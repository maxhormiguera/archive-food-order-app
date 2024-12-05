<template>
  <div>
    <div v-if="user == 'admin'" class="wrapper __admin-menu">
      <div v-if="show === 'Menu'" class="__calendar">
        <h1>MENU</h1>
        <!-- <button class="btn-accent1" @click="show='MenuForm'"> -->
        <button class="btn-accent1" @click="createMenu()">
          Create Menu
        </button>
        <Modal
          v-if="modalStatus === 'menuExisted'"
          :active.sync="isModalActive"
          message="A menu has already been created."
          type="failed"
          @confirmed="goToMenu()"
          @cancelled="modalStatus = ''"
        />
        <Modal
          v-if="modalStatus === 'lackingMeals'"
          :active.sync="isModalActive"
          message="There should be a minimum of 25 meals."
          type="failed"
          @confirmed="goToMenu()"
          @cancelled="modalStatus = ''"
        />
        <Calendar-Weekly :selected-date="selectedDate" :selected-range.sync="selectedRange" @update:selectedRange="logDate" />
      </div>

      <div v-if="show === 'MenuForm'" class="__create-menu-form">
        <h1>CREATE MENU</h1>
        <div class="input-group">
          <label>Menu Title</label>
          <input v-model="newMenuWeek.menuTitle" type="text" class="input __input-wide">
        </div>
        <div class="input-group">
          <label>Cut off</label>
          <input v-model="newMenuWeek.cutOff" type="date" class="input __input-wide">
        </div>
        <div class="__checkbox-container-holiday">
          <label class="checkbox">
            <input v-model="isHoliday" type="checkbox" name="select">
            <span class="__box" />
            <span class="__label">Holiday</span>
          </label>
        </div>
        <div class="input-group">
          <label>Meal Date</label>
          <input v-model="mealDate" type="date" class="input __input-wide" disabled>
        </div>
        <div class="input-group">
          <label for="meal">Select Meal</label>
          <div class="select __input-wide">
            <select v-model="selectMeal.name" :name="selectMeal.name">
              <option v-for="(meal, idx) in meals" :value="meal.name">
                {{ meal.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="btn-group">
          <button class="btn-accent1" @click="addMenu()">
            Add
          </button>
          <button class="btn-accent1" @click="clear()">
            Clear
          </button>
        </div>
      </div>

      <div v-if="show === 'Menu'" class="__meal-set">
        <h3>Meal Order for {{ dateRangeText }}</h3>
        <Menu-Set
          :dates="selectedRange.dates"
          :all-menus="allMenus"
        />
        <div class="_btn-group">
          <button class="btn-accent2" @click="modalStatus = 'delete'; deleteMenu()">
            Delete Menu
          </button>
          <button class="btn-accent1" @click="editMenu()">
            Edit Menu
          </button>
          <Modal
            v-if="modalStatus == 'delete'"
            :active.sync="isModalActive"
            message="Are you sure you want to delete this menu?"
            type="warning"
            @confirmed="deleteFurther()"
            @cancelled="modalStatus = ''"
          />
          <Modal
            v-if="modalStatus == 'noMenu'"
            :active.sync="isModalActive"
            message="Menu has not yet been created."
            type="failed"
            @confirmed="goToMenu()"
            @cancelled="modalStatus = ''"
          />
        </div>
      </div>

      <div v-if="show === 'MenuForm'" class="__meal-set">
        <h3>Meal Order for {{ dateRangeText }}</h3>
        <Menu-Set
          :dates="selectedRange.dates"
          selector
          :new-menu-week="newMenuWeek"
          :all-menus="allMenus"
          @menuDaySelected="menuDaySelected"
          @foodToRemove="foodToRemove"
        />
        <div class="_btn-group">
          <button class="btn-accent2" @click="back()">
            Back
          </button>
          <button class="btn-accent1" @click=" saveNewMenu()">
            Save
          </button>
          <Modal
            v-if="modalStatus=='saveNewMenu'"
            :active.sync="isModalActive"
            message="New Menu Created Successfully"
            type="success"
            @confirmed="goToMenu()"
            @cancelled="modalStatus = ''"
          />
          <Modal
            v-if="modalStatus == 'editNewMenu'"
            :active.sync="isModalActive"
            message="Menu Updated Successfully"
            type="success"
            @confirmed="goToMenu()"
            @cancelled="modalStatus = ''"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import mealDeleteRouter from '~/routes/mealDeleteRoutes'

type Meal = {
  _id: string,
  name: string,
  type?: string
}

type MenuDay = {
  menuTitle?: string,
  isHoliday: boolean,
  mealDate: Date,
  meals?: Array<Meal>
}

export default Vue.extend({
  data () {
    return {
      isModalActive: false,
      user: 'admin',
      selectedDate: new Date(),
      selectedRange: {
        start: new Date(),
        end: new Date(),
        weekNumber: 0,
        // eslint-disable-next-line no-array-constructor
        dates: new Array()
      },
      show: 'Menu',
      isHoliday: false,
      selectMeal: { _id: '', name: '', type: '' } as Meal,
      mealDate: new Date(),
      cutOff: new Date(),
      newMenuWeek: {
        _id: '',
        menuTitle: '',
        cutOff: new Date(),
        meals: new Array<MenuDay>()
      },
      meals: new Array<Meal>(),
      allMenus: new Array<MenuDay>(),
      modalStatus: ''
    }
  },
  computed: {
    dateRangeText () {
      const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }
      const start = this.selectedRange.start.toLocaleString('en-US', options as any).replace(/,/g, '').split(' ')
      const end = this.selectedRange.end.toLocaleString('en-US', options as any).replace(/,/g, '').split(' ')
      return start[1] !== end[1]
        ? `${start[1]} ${start[2]} - ${end[1]} ${end[2]}, ${end[3]}`
        : `${start[1]} ${start[2]} - ${end[2]}, ${end[3]}`
    }
  },
  mounted () {
    this.getFoods()
    this.getMenus()
  },
  methods: {
    menuDaySelected (menuDay:any) {
      console.log('::: menuDaySelected ', menuDay)

      this.isHoliday = menuDay.holiday
      this.cutOff = menuDay.cutOff
      this.mealDate = menuDay.date.toISOString().slice(0, 10)
    },
    logDate () {
      // console.log('::: logDate selectedRange ', this.selectedRange)
    },
    async getFoods () {
      const meals = await this.$axios.$get('/api/food')
      // console.log('asdfjaig')
      this.meals = meals
      console.log('thismeals in getfoods', this.meals)
    },
    addMenu () {
      console.log('this.newMenuWeek in addMenu', this.newMenuWeek)
      let numberOfMatchDates = 0
      let tempMealAdd:any
      // check if mealset is not empty
      if (this.newMenuWeek.meals.length !== 0) {
        this.newMenuWeek.meals.forEach((data:any, i:any) => {
          // check every meal set for the same date in range
          if (data.mealDate === this.mealDate) {
            numberOfMatchDates++
            // check if meals is not yet 5
            if (data.meals.length < 5) {
              if (this.selectMeal.name !== '') {
                tempMealAdd = this.meals.find((meal:any) => this.selectMeal.name == meal.name
                )
                this.newMenuWeek.meals[i].meals?.push(tempMealAdd)
                this.newMenuWeek.meals[i].isHoliday = this.isHoliday
              } else {
                console.log('Select a meal.')
              }
            } else {
              console.log('Meals are full. Delete some.')
            }
          }
        })
      }
      // console.log('::: this.selectMeal ', this.selectMeal)

      if (numberOfMatchDates == 0 && this.selectMeal.name != '' && this.meals.length != 0) {
        tempMealAdd = this.meals.find((x:any) => this.selectMeal.name == x.name)
        this.newMenuWeek.meals.push({
          mealDate: this.mealDate,
          isHoliday: this.isHoliday,
          meals: [tempMealAdd]
        })
      }
      // console.log('::: objab ', this.newMenuWeek.meals)
      this.newMenuWeek.meals = this.newMenuWeek.meals.sort((objA, objB) =>
        (new Date(objA.mealDate) as any) - (new Date(objB.mealDate) as any)
      )
      console.log('::: menu week in add Menu', this.newMenuWeek)
    },
    async saveNewMenu () {
      if (this.modalStatus == 'saveNewMenu') {
        const _foodTemp:any = []
        this.newMenuWeek.meals.forEach((result:any) => {
          const tempMeals = result.meals.map((meal:any) => {
            return ({
              name: meal.name,
              type: meal.type,
              _id: meal._id
            })
          })
          const tempFoods = {
            date: result.mealDate,
            holiday: result.isHoliday,
            name: tempMeals
          }
          _foodTemp.push(tempFoods)
        })

        // console.log('::: this.newMenuWeek.cutOff ', this.newMenuWeek.cutOff)

        const convertedDate = new Date(this.newMenuWeek.cutOff)

        await this.$axios.post('/api/menu', {
          cutOff: convertedDate,
          description: '',
          menuTitle: this.newMenuWeek.menuTitle,
          _food: _foodTemp
        })

        this.newMenuWeek = {
          _id: '',
          menuTitle: '',
          cutOff: new Date(),
          meals: new Array<MenuDay>()
        }
        this.isModalActive = !this.isModalActive
     
      } else if (this.modalStatus == 'editNewMenu') {
        // console.log('Menu Updated')
        console.log('this.newMenuWeek', this.newMenuWeek)

        const _foodTemp:any = []
        this.newMenuWeek.meals.forEach((result:any) => {
          const tempMeals = result.meals.map((meal:any) => {
            return ({
              name: meal.name,
              type: meal.type,
              _id: meal._id
            })
          })
          const tempFoods = {
            date: result.mealDate,
            holiday: result.isHoliday,
            name: tempMeals
          }
          _foodTemp.push(tempFoods)
        })

        const payload = {
          _id: this.newMenuWeek._id,
          cutOff: this.newMenuWeek.cutOff,
          menuTitle: this.newMenuWeek.menuTitle,
          _food: _foodTemp,
          description: ''
        }

        await this.$axios.put(`/api/menu/${payload._id}`, payload).catch(error => console.log(error)).then(()=>{console.log(`menu updated`)})

        this.newMenuWeek = {
          _id: '',
          menuTitle: '',
          cutOff: new Date(),
          meals: new Array<MenuDay>()
        }
        this.modalStatus = 'editNewMenu'
        this.isModalActive = !this.isModalActive
      }
    },
    async getMenus () {
      const allMenus = await this.$axios.$get(`/api/menu`)
      this.allMenus = allMenus
      console.log('this.allMenus in getMenus', this.allMenus)

      this.selectedDate.setDate(this.selectedDate.getDate()+7)
      this.selectedDate = new Date(this.selectedDate)
      console.log('this.selectedDate', this.selectedDate)
    },
    createMenu () {
      const tempDates:any = []
      this.selectedRange.dates.forEach((date:any) => {
        const menuDatesTemp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        tempDates.push(menuDatesTemp)
      })

      let cnt = 0
      let cntMenu = 0

      this.allMenus.forEach((eachMenu:any) => {
        eachMenu.menu.forEach((x:any) => {
          let xDate = x.date
          xDate = xDate?.slice(0, 10)

          tempDates.forEach((tempDate:any) => {
            tempDate == xDate && cnt++
          })
        })
        cntMenu++
      })

      if (cnt != 0 || cntMenu > 0) {
        this.modalStatus = 'menuExisted'
        this.isModalActive = !this.isModalActive
      } else if(this.meals.length < 25) { 
        this.modalStatus = 'lackingMeals'
        this.isModalActive = !this.isModalActive
      } else {
        
        let defaultDate = this.selectedRange.dates[0] 
        
        let tempCutOff:any = new Date(defaultDate)
        
        tempCutOff.setDate(tempCutOff.getDate()-3)
        
        tempCutOff = `${tempCutOff.getFullYear()}-${String(tempCutOff.getMonth() + 1).padStart(2, '0')}-${String(tempCutOff.getDate()).padStart(2, '0')}`
        
        defaultDate = `${defaultDate.getFullYear()}-${String(defaultDate.getMonth() + 1).padStart(2, '0')}-${String(defaultDate.getDate()).padStart(2, '0')}`

        this.modalStatus = 'saveNewMenu'
        this.newMenuWeek.menuTitle = `Meal Order for ${this.dateRangeText}`
        this.mealDate = defaultDate
        this.newMenuWeek.cutOff = tempCutOff
        // console.log('::: this.meals ', this.meals[0])
        // ::::::::::::::: !!!!! something here, undefined this.meals[0]
        this.selectMeal.name = this.meals[0]?.name
        this.show = 'MenuForm'
      }
    },
    foodToRemove (tempFood:any) {

      const tempDate = `${tempFood.date.getFullYear()}-${String(tempFood.date.getMonth() + 1).padStart(2, '0')}-${String(tempFood.date.getDate()).padStart(2, '0')}`

      this.newMenuWeek.meals.forEach((result:any) => {
        if (tempDate == result.mealDate) {
          result.meals.splice(tempFood.idx, 1)
        } else if (typeof result.mealDate === 'string') {
          const slicedDate = result.mealDate.slice(0, 10)

          if (tempDate == slicedDate) {
            result.meals.splice(tempFood.idx, 1)
          }
        }
      })
    },
    editMenu () {
      const tempDates:any = []
      this.selectedRange.dates.forEach((date:any) => {
        const menuDatesTemp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        tempDates.push(menuDatesTemp)
      })

      let cnt = 0

      this.allMenus.forEach((eachMenu:any) => {
        eachMenu.menu.forEach((x:any) => {
          let xDate = x.date
          xDate = xDate?.slice(0, 10)

          tempDates.forEach((tempDate:any) => {
            tempDate == xDate && cnt++
          })
        })
      })

      if (cnt == 0) {
        this.modalStatus = 'noMenu'
        this.isModalActive = !this.isModalActive
      } else {
        const tempDate = `${String(this.selectedRange.dates[0].getFullYear())}-${String(this.selectedRange.dates[0].getMonth() + 1).padStart(2, '0')}-${String(this.selectedRange.dates[0].getDate()).padStart(2, '0')}`

        const menuWeek:any = this.allMenus.find((a:any) => {
          // console.log('a menu', a)
          const tempDate2 = a.menu[0].date.slice(0, 10)
          return tempDate2 == tempDate
        })
        // console.log('menuWeek in edit menu', menuWeek)

        const menuWeekMeals = menuWeek.menu.map((a:any) => {
          const tempObj : any = {
            mealDate: a.date,
            isHoliday: a.holiday,
            meals: []
          }

          a.name.forEach((b:any) => {
            if (b.name != 'I\'m on leave') {
              const tempMeal = this.meals.find((meal:any) => meal.name == b.name)

              tempObj.meals.push({
                name: tempMeal.name,
                type: tempMeal.type
              })
            }
          })
          return tempObj
        })

        this.newMenuWeek = {
          _id: menuWeek._id,
          menuTitle: menuWeek.menuTitle,
          cutOff: menuWeek.cutOff.slice(0, 10),
          meals: menuWeekMeals
        }

        console.log('this.newMenuWeek in edit menu', this.newMenuWeek)

        let defaultDate = this.selectedRange.dates[0]

        defaultDate = `${defaultDate.getFullYear()}-${String(defaultDate.getMonth() + 1).padStart(2, '0')}-${String(defaultDate.getDate()).padStart(2, '0')}`

        this.selectMeal.name = this.meals[0]?.name
        this.mealDate = defaultDate

        this.show = 'MenuForm'
        this.modalStatus = 'editNewMenu'
      }
    },
    deleteMenu () {
      const tempDates:any = []
      this.selectedRange.dates.forEach((date:any) => {
        const menuDatesTemp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        tempDates.push(menuDatesTemp)
      })

      let cnt = 0

      this.allMenus.forEach((eachMenu:any) => {
        eachMenu.menu.forEach((x:any) => {
          let xDate = x.date
          xDate = xDate?.slice(0, 10)

          tempDates.forEach((tempDate:any) => {
            tempDate == xDate && cnt++
          })
        })
      })

      if (cnt == 0) {
        // alert('There is no menu in the choosen week.')
        // console.log('this.isModalActive ==> ', this.isModalActive)
        this.modalStatus = 'noMenu'
        // console.log('this.modalStatus ==> ', this.modalStatus)
        this.isModalActive = !this.isModalActive
      } else {
        this.isModalActive = !this.isModalActive
      }
    },
    async deleteFurther () {
      const tempDate = `${String(this.selectedRange.dates[0].getFullYear())}-${String(this.selectedRange.dates[0].getMonth() + 1).padStart(2, '0')}-${String(this.selectedRange.dates[0].getDate()).padStart(2, '0')}`

      const menuWeek:any = this.allMenus.find((a:any) => {
        const tempDate2 = a.menu[0].date.slice(0, 10)
        // console.log(tempDate2)
        // console.log(tempDate)
        return tempDate2 == tempDate
      })
      await this.$axios.delete('/api/menu', {
        data: { toDelete: [menuWeek._id] }
      })
      this.allMenus = []
      this.getMenus()
      this.show = 'Menu'
      this.modalStatus = ''
      // window.location.href = 'http://localhost:3000/menu'
    },
    back () {
      this.show = 'Menu'
      this.modalStatus = ''
    },
    clear () {
      this.newMenuWeek = {
        _id: '',
        menuTitle: '',
        cutOff: new Date(),
        meals: new Array()
      }
      this.mealDate = new Date()
      this.cutOff = new Date()
      this.selectMeal = { _id: '', name: '', type: '' }
      this.isHoliday = false
    },
    goToMenu () {
      this.show = 'Menu'
      this.modalStatus = ''
      window.location.href = 'http://localhost:3000/menu'
    }
  }
})
</script>

<style scoped lang="stylus">
.wrapper
  flexbox stretch space-between row 3em
  width-height 100%
  position relative
  > div
    flex 1

  .__create-menu-form
    transition margin 0.8s ease, opacity 0.4s ease
    h1
      margin-bottom 1,2rem
    .__checkbox-container-holiday
      margin 4rem 0 1rem
      position relative
      text-align right

    .input-group
      flexbox center space-between row 1rem
      margin-bottom 1.2rem
      font-size 1.125rem
      font-weight bold
      .input
      .select
        flex 0 1 80%
    .btn-group
      text-align right

  .__meal-set, .__calendar
    flexbox($direction: column, $gap: 1.2rem)

  ._btn-group
    flexbox($justify: flex-end, $gap: 1rem)
</style>
