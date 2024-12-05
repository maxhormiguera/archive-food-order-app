<template>
  <div>
    <div v-if="show === 'Orders'" class="wrapper">
      <div class="__calendar">
        <h1>ORDER LIST</h1>
        <button class="btn-accent1" @click="getOrders()">
          View Details
        </button>
        <Calendar-Weekly :selected-date="selectedDate" :selected-range.sync="selectedRange" @update:selectedRange="logDate" />
      </div>

      <!-- ::: this __meal-set div is a better candidate for turning into a component, variable content values that you can pass an array of objects to, used also in Orders page -->
      <div class="__meal-set">
        <h3>Meal Order for {{ dateRangeText }}</h3>
        <!-- <Menu-Set :dates="selectedRange.dates" :all-menus="allMenus" /> -->
        <Menu-Set
          :dates="selectedRange.dates"
          :all-menus="allMenus"
          :selector="selector"
        />
      </div>
    </div>

    <div v-if="show == 'Details'" class="wrapper">
      <div class="order-container">
        <div class="order-label">
          <div class="date-range">
            <h1>Order List</h1>
            <div class="meal-label">
              <h3>Meal Order for {{ dateRangeText }}</h3>
              <!-- <h4>Meal Order for {{ selectedRange.weekText }}</h4> -->
              <button @click="show = 'Orders'">
                <img src="~/assets/images/calendar.svg" alt="calendar">
              </button>
            </div>
          </div>

          <div class="legend">
            <h4>Legend :</h4>
            <span class="lunchbox" />
            <h4>Lunch</h4>
            <span class="dinnerbox" />
            <h4>Dinner</h4>
            <button class="btn-accent1">
              Export to Excel
            </button>
          </div>
        </div>
        <div class="__order-table">
          <ul class="table-tabhead">
            <li :class="show == 'Details' ? '--active' : ''" @click="getOrders()">
              Orders
            </li>
            <li :class="show == 'Summary' ? '--active' : ''" @click="getMealSummary()">
              Meal Summary
            </li>
          </ul>
          <table>
            <thead>
              <tr>
                <th class="__header-name">
                  Name
                </th>
                <th v-for="(dayheader, index) in selectedRange.dates">
                  <p>{{ dayheader.toLocaleString('en-us', {month: 'long', day: 'numeric'}) }}</p>
                  <p>{{ dayheader.toLocaleString('en-us', {weekday: 'long'}) }}</p>
                </th>
              </tr>
            </thead>
            <!-- warp -->
            <tbody>
              <tr v-for="u in usersName" :key="u.name">
                <td>{{ u.name }}</td>
                <td v-for="o in orderMeals" :key="o.food" :class="o.mealTime == 'Lunch' ? 'lunchCnt' : 'dinnerCnt'">
                  {{ o.food }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="show == 'Summary'" class="wrapper">
      <div class="order-container">
        <div class="order-label">
          <div class="date-range">
            <h1>Order List</h1>
            <div class="meal-label">
              <h3>Meal Order for {{ dateRangeText }}</h3>
              <button @click="show = 'Orders'">
                <img src="~/assets/images/calendar.svg" alt="calendar">
              </button>
            </div>
          </div>

          <div class="legend">
            <h4>Legend :</h4>
            <h4>Lunch</h4>
            <span class="lunchbox" />
            <h4>Dinner</h4>
            <span class="dinnerbox" />
            <h4>Total</h4>
            <span class="totalbox" />
            <h4>On Leave</h4>
            <span class="leavebox" />
            <button class="btn-accent1">
              Export to Excel
            </button>
          </div>
        </div>
        <div class="__order-table">
          <div class="btn-orders">
            <ul class="table-tabhead">
              <li :class="show == 'Details' ? '--active' : ''" @click="show = 'Details'">
                Orders
              </li>
              <li :class="show == 'Summary' ? '--active' : ''" @click="show = 'Summary'">
                Meal Summary
              </li>
            </ul>
          </div>
          <table>
            <thead>
              <tr>
                <th class="__header-name">
                  Meal
                </th>
                <th v-for="(dayheader, index) in selectedRange.dates">
                  <p>{{ dayheader.toLocaleString('en-us', {month: 'long', day: 'numeric'}) }}</p>
                  <p>{{ dayheader.toLocaleString('en-us', {weekday: 'long'}) }}</p>
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- first -->
              <tr v-for="(first,index) in mealSummary.first" v-if="index<5" :key="first.name">
                <td v-if="(first.name != 'Total' && first.name != 'On Leave')">
                  {{ first.name }}
                </td>
                <td v-for="(td,i1) in tdCnt" :key="td" :v-if="i1 < 5">
                  <div v-if="td == tdCnt[0]" class="--spanning">
                    <span class="lunchCnt">{{ first.lunch }}</span>
                    <span class="dinnerCnt">{{ first.dinner }}</span>
                    <span class="totalCnt">{{ first.count }}</span>
                    <span class="leaveCnt">{{ first.onLeave }}</span>
                  </div>
                  <div v-if="td <= tdCnt[4] && td != tdCnt[0]" class="--spanning">
                    <span class="lunchCnt">0</span>
                    <span class="dinnerCnt">0</span>
                    <span class="totalCnt">0</span>
                    <span class="leaveCnt">0</span>
                  </div>
                </td>
              </tr>
              <!-- second -->
              <tr v-for="(second,index2) in mealSummary.second" v-if="index2<5" :key="second.name">
                <td v-if="(second.name != 'Total' && second.name != 'On Leave')">
                  {{ second.name }}
                </td>
                <td v-for="(td,i2) in tdCnt" :key="td" :v-if="i2 < 5">
                  <div v-if="td == tdCnt[1]" class="--spanning">
                    <span class="lunchCnt">{{ second.lunch }}</span>
                    <span class="dinnerCnt">{{ second.dinner }}</span>
                    <span class="totalCnt">{{ second.count }}</span>
                    <span class="leaveCnt">{{ second.onLeave }}</span>
                  </div>
                  <div v-if="td <= tdCnt[4] && td != tdCnt[1] " class="--spanning">
                    <span class="lunchCnt">0</span>
                    <span class="dinnerCnt">0</span>
                    <span class="totalCnt">0</span>
                    <span class="leaveCnt">0</span>
                  </div>
                </td>
              </tr>
              <!-- third -->
              <tr v-for="(third,index2) in mealSummary.third" v-if="index2<5" :key="third.name">
                <td v-if="(third.name != 'Total' && third.name != 'On Leave')">
                  {{ third.name }}
                </td>
                <td v-for="(td,i3) in tdCnt" :key="td" :v-if="i3 < 5">
                  <div v-if="td == tdCnt[2]" class="--spanning">
                    <span class="lunchCnt">{{ third.lunch }}</span>
                    <span class="dinnerCnt">{{ third.dinner }}</span>
                    <span class="totalCnt">{{ third.count }}</span>
                    <span class="leaveCnt">{{ third.onLeave }}</span>
                  </div>
                  <div v-if="td <= tdCnt[4] && td != tdCnt[2] " class="--spanning">
                    <span class="lunchCnt">0</span>
                    <span class="dinnerCnt">0</span>
                    <span class="totalCnt">0</span>
                    <span class="leaveCnt">0</span>
                  </div>
                </td>
              </tr>
              <!-- fourth -->
              <tr v-for="(fourth, index4) in mealSummary.fourth" v-if="index4<5" :key="fourth.name">
                <td v-if=" index4 < 5">
                  {{ fourth.name }}
                </td>
                <td v-for="(td,i4) in tdCnt" :key="td" :v-if="i4 < 5">
                  <div v-if="td == tdCnt[3]" class="--spanning">
                    <span class="lunchCnt">{{ fourth.lunch }}</span>
                    <span class="dinnerCnt">{{ fourth.dinner }}</span>
                    <span class="totalCnt">{{ fourth.count }}</span>
                    <span class="leaveCnt">{{ fourth.onLeave }}</span>
                  </div>
                  <div v-if="td <= tdCnt[4] && td != tdCnt[3] " class="--spanning">
                    <span class="lunchCnt">0</span>
                    <span class="dinnerCnt">0</span>
                    <span class="totalCnt">0</span>
                    <span class="leaveCnt">0</span>
                  </div>
                </td>
              </tr>
              <!-- fifth -->
              <tr v-for="(fifth, index5) in mealSummary.fifth" v-if="index5<5" :key="fifth.name">
                <td v-if=" index5 < 5">
                  {{ fifth.name }}
                </td>
                <td v-for="(td,i5) in tdCnt" :key="td" :v-if="i5 < 5">
                  <div v-if="td == tdCnt[4]" class="--spanning">
                    <span class="lunchCnt">{{ fifth.lunch }}</span>
                    <span class="dinnerCnt">{{ fifth.dinner }}</span>
                    <span class="totalCnt">{{ fifth.count }}</span>
                    <span class="leaveCnt">{{ fifth.onLeave }}</span>
                  </div>
                  <div v-if="td <= tdCnt[3] && td != tdCnt[4] " class="--spanning">
                    <span class="lunchCnt">0</span>
                    <span class="dinnerCnt">0</span>
                    <span class="totalCnt">0</span>
                    <span class="leaveCnt">0</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { data } from 'browserslist'
import Vue from 'vue'
import { pushMail } from '~/services/mailerService'

type idx = any

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

type orderDetails = {
  name: string,
  ordered: Array<orderedDetails>
}

type orderedDetails = {
  date: string,
  food: string,
  holiday: Boolean,
  mealTime: string
}

type usersName = {
  name: string,
  order: Array<orderedDetails>
}

type weekFoodOrders = {
  food: string,
  order: Array<orderedDetails>,
  mealTime: string
}

export default Vue.extend({
  data () {
    return {
      allMenus: new Array(),
      selectedDate: new Date(),
      selector: false,
      selectedRange: {
        start: new Date(),
        end: new Date(),
        weekNumber: 0,
        dates: new Array()
      },
      menuWeek: {
        _id: '',
        menuTitle: '',
        cutOff: new Date(),
        meals: new Array<MenuDay>()
      },
      mealSummary: {
        first: new Array(),
        second: new Array(),
        third: new Array(),
        fourth: new Array(),
        fifth: new Array()
      },
      orders: new Array<orderDetails>(),
      show: 'Orders',
      tdCnt: ['a', 'b', 'c', 'd', 'e'],
      usersName: new Array<usersName>(),
      orderMeals: new Array<weekFoodOrders>()
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
    this.getMenus()
  },
  methods: {
    logDate () {
      console.log('::: logDate selectedRange ', this.selectedRange)
    },

    async getOrders () {
      const tempDate = `${this.selectedRange.dates[0].getFullYear()}-${String(this.selectedRange.dates[0].getMonth() + 1).padStart(2, '0')}-${String(this.selectedRange.dates[0].getDate()).padStart(2, '0')}`
      const tempMenuWeek = this.allMenus.find((menu:any) => {
        return (menu.menu[0].date.slice(0, 10) === tempDate)
      })
      console.log('this is tempmenu week', tempMenuWeek)
      console.log('this is tempDate', tempDate)
      console.log('all menus', this.allMenus)
      if (tempMenuWeek !== '') {
        const id = tempMenuWeek._id
        const result = await this.$axios.$get(`/api/order/${id}`)
        console.log('asdfasdf----asdf', result)
        const temporary2:any = []
        const weekOrderTemp:any = []
        result.forEach((getDataName:any) => {
          console.log('here we go', getDataName)
          const temporary3 = { name: '' }
          temporary3.name = getDataName.name
          temporary2.push(temporary3)
          console.log('asdfgh', temporary2)
          getDataName.order.forEach((getDataName2:any) => {
            console.log('hold on til may', getDataName2)
            const weekOrderTemp2 = { food: '', mealTime: '' }
            weekOrderTemp2.food = getDataName2.food
            weekOrderTemp2.mealTime = getDataName2.mealTime
            weekOrderTemp.push(weekOrderTemp2)
            console.log('this love is out of control', weekOrderTemp)
          })
        })
        this.usersName = temporary2
        this.orderMeals = weekOrderTemp
      } else {
        this.orders = []
        console.log('way sulod')
      }
      this.show = 'Details'
      // warp
    },
    async getMenus () {
      const allMenus = await this.$axios.$get('/api/menu')
      console.log('allMenus in getMenus Order', allMenus)
      this.allMenus = allMenus
    },
    // eslint-disable-next-line require-await
    async getMealSummary () {
      const dataSummary = await this.$axios.$get('/api/menu')
      const tempDate2 = `${this.selectedRange.dates[0].getFullYear()}-${String(this.selectedRange.dates[0].getMonth() + 1).padStart(2, '0')}-${String(this.selectedRange.dates[0].getDate()).padStart(2, '0')}`
      console.log('tempDate', tempDate2)
      console.log('------', dataSummary)
      dataSummary.forEach((d:any) => {
        console.log('datasummary minatay', d)
        d.menu.forEach((d2:any) => {
          if (d2.date.slice(0, 10) === tempDate2) {
            console.log('yawa', d2)
            console.log('hay nako', d)
            this.menuWeek.menuTitle = d.menuTitle
            this.menuWeek._id = d._id
            this.menuWeek.cutOff = d.cutOff
            this.menuWeek.meals = d.menu

            fetch(`http://localhost:3000/api/orderCount/${d._id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            })
              .then(response2 => response2.json())
              .then((data2:any) => {
                console.log('data in mealsummaaaary', data2)
                this.mealSummary.first = data2['0']
                console.log('this is data 0', data2['0'])
                this.mealSummary.second = data2['1']
                this.mealSummary.third = data2['2']
                this.mealSummary.fourth = data2['3']
                this.mealSummary.fifth = data2['4']
              })
              .catch(err => console.log(err.message))
          }
        })
      })
      this.show = 'Summary'
    }
  }
})

</script>

<style scoped lang="stylus">
.--spanning
  display flex
  justify-content space-between
.wrapper
  flexbox stretch space-between row 3em
  width-height 100%
  position relative
  .table-tabhead
    display flex
    gap 5px
    margin 0
    padding 0
    li
      cursor pointer
      padding 10px
    li.--active
      font-weight bold
      background-color $color-theme3
      border-radius $corner-rounding-sm $corner-rounding-sm 0 0
  > div
    flex 1

  .__meal-set, .__calendar
    flex-direction column
    gap 1.2rem
    h3
      margin-bottom 1rem
    h1
      margin-bottom 2rem
    .btn-accent1
      float right
      margin-bottom 2rem
  ._btn-group
    display inline-flex
    justify-content space-between
    gap 1rem

  .order-container
    .order-label
      flexbox center space-between row 1rem
      .date-range h1
        padding-bottom 1rem
    .meal-label
      display flex
      gap 0.3rem
      padding-bottom 1rem
      button
        border none
        background-color transparent
        img
          height 0.9rem
          width 0.9rem
          cursor pointer
    .legend
      grid-area lunch
      display flex
      gap 1rem
      justify-content flex-end
      margin-top 4px
      float right
      span
        margin-top 25px
      h4
        margin-top 30px
      .lunchbox
        height 1.5rem
        width 1.5rem
        border 1px solid #3E9F58
        background-color #3E9F58
      .dinnerbox
        height 1.5rem
        width 1.5rem
        border 1px solid $color-accent2
        background-color $color-accent2
      .totalbox
        height 1.5rem
        width 1.5rem
        border 1px solid color $color-text-main
        background-color $color-text-main
      .leavebox
        height 1.5rem
        width 1.5rem
        border 1px solid $color-theme4
        background-color $color-theme4
  .__order-table
    table
      width 100%
      border-collapse collapse
      overflow hidden
      th
        background-color $color-theme3
        color $color-text-alt
        text-align center
        padding 1rem
      th:not(:last-child)
        border-right 1px solid black
      .__header-name
        text-align left
        padding 1rem
        padding-right 5rem
      tbody
        background $color-text-alt
      td
        text-align center
        padding 1rem
        font-weight bold
      .lunchCnt
        color #3E9F58
      .dinnerCnt
        color $color-accent2
      .totalCnt
        color $color-text-main
      .leaveCnt
        color $color-theme4
      td:not(:last-child)
        border-right 1px solid black
</style>
