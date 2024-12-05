<template>
  <div class="wrapper">
    <h1>Order History</h1>
    <div class="order-history">
      <div class="column">
        <div class="week-orders --paper">
          <table>
            <tr>
              <th>
                <h3>{{ dateRangeText }}</h3>
              </th>
            </tr>
            <div class="--position">
              <tr>
                <td class="--p1">
                  <h4 v-for="u in usersTime" :key="u.time">
                    {{ u.time }}
                  </h4>
                </td>
              </tr>
              <tr>
                <td class="--p2">
                  <h4 v-for="d in dateFoods" :key="d">
                    {{ d.date.toLocaleString('en-us', { weekday: 'long' }) }}
                  </h4>
                </td>
              </tr>
              <tr>
                <td class="--p3">
                  <div v-for="t in usersFood" :key="t.food" class="broken-line --p3" />
                </td>
              </tr>
              <tr>
                <td class="--p4">
                  <h4 v-for="t in usersFood" :key="t.food">
                    {{ t.food }}
                  </h4>
                </td>
              </tr>
            </div>
          </table>
        </div>
        <div class="__edit-btn">
          <Nuxt-Link to="/">
            <button class="btn-accent1" @click="edit()">
              Edit
            </button>
          </Nuxt-Link>
        </div>
      </div>
      <div class="__calendar">
        <Calendar-Weekly :selected-date="selectedDate" :selected-range.sync="selectedRange" @update:selectedRange="logDate" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

type usersTime = {
  food: string,
  time: string,
  date: string
}
type usersFood = {
  food: string,
  time: string,
}
type dateFoods = {
  food: string,
  time: string,
  date: Date
}

export default Vue.extend({
  data () {
    return {
      selectedDate: new Date(),
      selectedRange: {
        start: new Date(),
        end: new Date(),
        weekNumber: 0
      },
      usersTime: new Array<usersTime>(),
      usersFood: new Array<usersFood>(),
      dateFoods: new Array<dateFoods>()
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
    this.showWeekOrder()
  },
  methods: {
    logDate () {
      console.log('::: logDate selectedRange ', this.selectedRange)
      console.log('::: logDate selectedRange.start ', this.selectedRange.start)
      console.log('::: logDate selectedRange.end ', this.selectedRange.end)

      const curr = new Date()
      console.log(curr)

      const newRange = {
        start: new Date(curr),
        end: new Date(curr),
        dates: new Array()
      }

      newRange.start.setDate(curr.getDate() - curr.getDay() + 8)
      newRange.end.setDate(curr.getDate() - curr.getDay() + 12)

      let dt
      for (newRange.dates, dt = new Date(newRange.start); dt <= new Date(newRange.end); dt.setDate(dt.getDate() + 1)) {
        newRange.dates.push(new Date(dt))
      }

      this.selectedRange.start = newRange.start
      this.selectedRange.end = newRange.end
      this.selectedRange.simpleDates = newRange.dates
      this.selectedRange.simpleDates.forEach((gd, index) => {
        this.userMeal[index].date = gd
      })
    },
    dateText (dayheader:any) {
      const option = { year: 'numeric', month: 'long', day: 'numeric' }
      const day = dayheader.toLocaleString('en-us', { weekday: 'long' })
      return `${dayheader.toLocaleString('en-us', option)} (${day})`
    },
    async showWeekOrder () {
      const mealWeek = await this.$axios.$get('/userOrders')
      const tempMeal:any = []
      const tempFoodMeal:any = []
      const tempDateMeal:any = []
      console.log('this is mealWeek', mealWeek)
      mealWeek.forEach((weeklyOrder:any) => {
        console.log('this is weeklyorder', weeklyOrder)
        weeklyOrder.order.forEach((wo:any) => {
          console.log('this is wo', wo)
          const tempMeal2 = { time: '' }
          const tempFoodMeal2 = { food: '' }
          let tempFoodMeal3:any = { date: new Date() }
          tempMeal2.time = wo.mealTime
          tempFoodMeal2.food = wo.food
          tempFoodMeal3.date = new Date(wo.date)
          tempMeal.push(tempMeal2)
          tempFoodMeal.push(tempFoodMeal2)
          tempDateMeal.push(tempFoodMeal3)
        })
        this.usersTime = tempMeal
        this.usersFood = tempFoodMeal
        this.dateFoods = tempDateMeal
      })
    },
    async submitOrder () {
      console.log('this.edit in submit', this.edit)
      let orderSubmitCnt = 0
      if (this.menu) {
        this.menu.orders.forEach((order:any) => {
          order == this.userData._id && orderSubmitCnt++
        })
      }

      if (orderSubmitCnt != 0 && this.mode != 'edit') {
        window.location.href = `${process.env.baseUrl}/submit-order`
      } else {
        // console.log('this.menu in submitOrder', this.menu)

        if (this.mode == 'edit') {
          const payload = {
            _id: this.userOrder._id,
            _user: this.userOrder._user,
            name: this.userData.fullName,
            mealType: this.userOrder.mealType == true ? 'Customize Meal Time' : this.timeChosen == 'Lunch' ? 'All Lunch' : 'All Dinner',
            order: [],
            office: ''
          }
          // console.log('this.userMeal in submitOrder', this.userMeal)
          // console.log('this.menu in submitOrder', this.menu)
          // await this.$axios.$post('/api/forOrder', )
          let tempOrder = this.userOrder.order.map((menu:any, i:any) => {
            let tempData = {
              date: menu.date,
              food: this.userMeal[i].meal,
              options: menu.options,
              holiday: menu.holiday,
              item: i,
              mealTime: payload.mealType == 'Customize Meal Time' ? this.userMeal[i].time : payload.mealType == 'All Lunch' ? 'Lunch' : 'Dinner',
              office: ''
            }
            return(tempData)
          })

          payload.order = tempOrder
          await this.$axios.$put(`/userOrders/${payload._id}`, payload).catch(error => {console.log('::: oops? in user menu', error)})
          .then(()=>{
            this.mode = ''
            alert(`order updated`)
            window.location.href = `${process.env.baseUrl}/`
            })
        } else {
          const payload = {
            _menu: this.menu._id,
            _user: this.userData._id,
            name: this.userData.fullName,
            cutOffDate: this.menu.cutOffDate,
            menuTitle: this.menu.menuTitle,
            mealType: this.customizeMealTime == true ? 'Customize Meal Time' : this.timeChosen == 'Lunch' ? 'All Lunch' : 'All Dinner',
            order: []
          }
          // console.log('this.userMeal in submitOrder', this.userMeal)
          // console.log('this.menu in submitOrder', this.menu)
          // await this.$axios.$post('/api/forOrder', )
          let tempOrder = this.menu.menu.map((menu:any, i:any) => {
            let tempData = {
              date: menu.date,
              food: this.userMeal[i].meal,
              options: menu.name,
              holiday: menu.holiday,
              item: i,
              mealTime: payload.mealType == 'Customize Meal Time' ? this.userMeal[i].time : payload.mealType == 'All Lunch' ? 'Lunch' : 'Dinner'
            }
            return(tempData)
          })
          payload.order = tempOrder

          await this.$axios.$post('/api/order', payload).catch(error => {
            console.log('::: oops? in user menu', error)
          }).then(()=> {window.location.href = `${process.env.baseUrl}/confirm` })
        }
      }
    },
    async edit () {
      let userOrders = await this.$axios.$get('/userOrders')
      // console.log('userOrders in edit', userOrders)
      // console.log('thisMenu in edit', this.menu)
      userOrders = userOrders.filter((data:any) => {
        return data._user == this.userData._id
      })
      userOrders = userOrders[userOrders.length-1]
      // console.log('userOrders in edit', userOrders)
      userOrders.order.forEach((order:any, i:any) => {
        let tempDate:any = new Date(order.date)
        tempDate = tempDate.toLocaleString('en-us', { weekday: 'long' })
        this.userMeal[i].date = tempDate
        this.userMeal[i].meal = order.food
        this.userMeal[i].time = order.mealTime
      })
      // console.log(this.userMeal)
      this.mode = 'edit'
      console.log('userOrders in edit', userOrders)
      this.userOrder = await this.$axios.$get(`/userOrders/${userOrders._id}`)
      console.log('userOrder in edit', this.userOrder)
    }
  }
})
</script>

<style scoped lang ="stylus">
.wrapper
  h1
    margin-bottom 3rem
  .order-history
    flexbox flex-start space-between row 3rem
    .week-orders
      margin-bottom 1.2rem
      padding 1.5rem
      border-radius $corner-rounding-md
      flex 1 1 50%
      width 40rem
      table
        display inline-flex
        flex-direction column
        width 100%
        overflow hidden
        tr
          display flex
          margin 1rem
        td
          width 9rem
          .__food--label
            text-align right
        .broken-line
          border none
          border-top 5px dotted $color-text-grey
          height 2px
          margin-top 0.4rem
          width 5.3rem
          margin: 1rem;
          padding: 0.95rem;
    .__edit-btn
      flexbox($justify:flex-end)
    .__calendar
      height 100%
      max-width 44rem
      min-width 30rem
      flex 1 1 50%
    .--position
      display flex
      position relative
      .--p1
        width 5rem
        text-align left
        h4
          padding 1rem
      .--p2
        width 6.5rem
        h4
          padding 1rem
      .--p4
        width 10rem
        text-align right
        h4
          padding 1rem
</style>
