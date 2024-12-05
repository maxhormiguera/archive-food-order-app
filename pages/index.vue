<template>
  <div v-if="show == 'user'" class="wrapper __user-menu">
    <div class="__text">
      <h1>Next Week's Menu</h1>
      <h3>Please select one meal per day for your order next week. Thanks.</h3>
      <p>
        Reminders:<br>
        CUT-OFF for orders 3PM on Friday<br>
        Employees on leave should not order on their leave days and should indicate so in this meal order form
      </p>
    </div>
    <div class="__order-options">
      <div v-for="(menuItem, index) in menu.menu" :key="index" class="__next-week-menu-set-container">
        <div>
          <div v-for="(dayheader,index2) in selectedRange.simpleDates" v-if="index2 == index" :key="index2" class="card-header">
            <h2>{{ dateText(dayheader) }}</h2>
            <label class="radio-leave-button">
              <input v-model="userMeal[index].meal" type="radio" :name="index" value="I'm on Leave">
              <span>I'm on Leave</span>
            </label>
          </div>

          <div class="card-body">
            <label v-for="(meal, idx) in menuItem.name" v-if="idx < 5" :key="idx" class="radio-container">
              <input v-model="userMeal[index].meal" type="radio" :name="index" :value="meal.name">
              <span class="checkmark">
                <!-- <img :src="mealType(meal.name)" alt=""> -->
                <img :src="require(`~/assets/images/category/${mealType(meal.name)}.svg`)" alt="">
                <span>{{ meal.name }}</span>
              </span>
            </label>
          </div>
          <div v-if="customizeMealTime" class="__group __customize">
            <label class="radio">
              <input v-model="userMeal[index].time" type="radio" :name="index+6" value="Lunch">
              <span class="__circle" />
              <span class="--bold">Lunch</span>
            </label>
            <label class="radio">
              <input v-model="userMeal[index].time" type="radio" :name="index+6" value="Dinner">
              <span class="__circle" />
              <span class="--bold">Dinner</span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class=" __group __meal-time">
      <h4>Meal Time</h4>
      <label class="radio">
        <input v-model="timeChosen" type="radio" name="coconuts" value="Lunch" @click="customizeMealTime = false">
        <span class="__circle" />
        <span class="__label">All Lunch</span>
      </label>
      <label class="radio">
        <input v-model="timeChosen" type="radio" name="coconuts" value="Dinner" @click="customizeMealTime = false">
        <span class="__circle" />
        <span class="__label">All Dinner</span>
      </label>
      <label class="radio">
        <input type="radio" name="coconuts" @click="customizeMealTime = true">
        <span class="__circle" />
        <span class="__label">Customize Meal Time</span>
      </label>
    </div>
    <div class="__order-summary">
      <div class="--ordermenu-container">
        <h1>Order's Menu</h1>
        <img src="~/assets/images/cart.svg" alt="cart">
      </div>
      <div class="__order-container">
        <div v-for="u in userMeal" v-if="u.meal != ''" :key="u.meal" class="__chosen-order">
          <h4 class="--show-day">
            {{ u.date.toLocaleString('en-us', { weekday: 'long' }) }}
          </h4>
          <div class="broken-line" />
          <h4 class="--chosen-meal">
            {{ u.meal }}
          </h4>
        </div>
      </div>
    </div>

    <button class="btn-accent1 --submit __submit-btn" @click="isModalActive = !isModalActive">
      Submit
    </button>
    <button class="btn-accent2" @click="edit()">
      Edit
    </button>
    <div class="modal-group">
      <Modal :place-order.sync="isModalActive" @confirmed="submitOrder()">
        <template #content>
          <div class="week-orders">
            <h4 class="satisfy">
              You are about to send your food order. Are you satisfied with your choices?
            </h4>
            <table>
              <div v-for="u in userMeal" :key="u.time" class="__the-orders">
                <!-- warp 1 -->
                <h4 v-if="customizeMealTime == true" class="__the-mealtime">
                  {{ u.time }}
                </h4>
                <h4 v-else class="__the-mealtime">
                  {{ timeChosen }}
                </h4>
                <h4 class="__the-day">
                  {{ u.date.toLocaleString('en-us', { weekday: 'long' }) }}
                </h4>
                <div class="__broken-line" />
                <h4 class="__the-meals">
                  {{ u.meal }}
                </h4>
              </div>
            </table>
          </div>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script lang="ts">
import { data } from 'browserslist'
import Vue from 'vue'
import orderHistoryVue from './order-history.vue'
import { response } from '~/app'

type Meal = {
  _id: string,
  name: string,
  type?: string
}

export default Vue.extend({
  data () {
    return {
      timeChosen: 'Lunch',
      customizeMealTime: false,
      showChosenMeal: false,
      isModalActive: false,
      isCreating: false,
      user: 'admin',
      menuShow: [],
      selectedDate: new Date(),
      selectedRange: {
        start: new Date(),
        end: new Date(),
        weekNumber: 0,
        simpleDates: new Array()
      },
      menu: [],
      show: 'user',
      select: false,
      newMenu: {
        menuTitle: '',
        cutOff: '',
        isHoliday: false,
        mealDate: '',
        selectMeal: ''
      },
      newMenuWeek: {
        menuTitle: '',
        cutOff: '',
        menu: [{
          date: '',
          meals: []
        }]
      },
      userMeal: [{
        date: new Date(),
        meal: '',
        time: ''
      },
      {
        date: new Date(),
        meal: '',
        time: ''
      },
      {
        date: new Date(),
        meal: '',
        time: ''
      },
      {
        date: new Date(),
        meal: '',
        time: ''
      },
      {
        date: new Date(),
        meal: '',
        time: ''
      }
      ],
      meals: new Array<Meal>(),
      userData: {
        createdAt: '',
        email: '',
        familyName: '',
        fullName: '',
        givenName: '',
        updatedAt: '',
        userType: '',
        _v: 1,
        _id: '',
        _orders: new Array<any>()
      },
      mode: '',
      userOrder: {}
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
    this.logDate()
    this.showNextWeekMenu()
    this.getFoods()
  },
  methods: {
    newMenuDay () {
      const data = {
        menuTitle: this.newMenu.menuTitle,
        cutOff: this.newMenu.cutOff,
        isHoliday: this.newMenu.isHoliday,
        mealDate: this.newMenu.mealDate,
        selectMeal: this.newMenu.selectMeal
      }
      console.log(data)
    },
    logDate () {
      // the @confirmed event is emitted when the user clicks the confirm/ok button, you can call whatever function you want from that event, same ra sa @click or @onchange
      console.log('::: logDate selectedRange.start ', this.selectedRange.start)
      console.log('::: logDate selectedRange.end ', this.selectedRange.end)
      console.log('::: logDate selectedRange ', this.selectedRange.simpleDates)

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

      // fetch('http://localhost:8080/api/forOrder/')
      //   .then(res => res.json())
      //   .then(data => console.log('data in forOrder', data.res))
      //   .catch(err => console.log(err.message))
    },
    dateText (dayheader:any) {
      const option = { year: 'numeric', month: 'long', day: 'numeric' }
      const day = dayheader.toLocaleString('en-us', { weekday: 'long' })
      return `${dayheader.toLocaleString('en-us', option)} (${day})`
    },
    async showNextWeekMenu () {
      const dataForOrder = await this.$axios.$get('/api/forOrder')
      console.log('::: (i don\'t know asa ni gigamit ang /forOrder api) data ', dataForOrder)

      let date = `${this.selectedRange.simpleDates[0].getFullYear()}-${this.selectedRange.simpleDates[0].getMonth()+1}-${this.selectedRange.simpleDates[0].getDate()}`
      // console.log('this.selectedRange.simpleDates[0] in showNext', date)
      // console.log('dataForOrder.menu[0].date.slice(0, 10) in showNext', dataForOrder.menu[0].date.slice(0, 10))
      if (dataForOrder.menu[0].date.slice(0, 10) == date) {
        this.menu = dataForOrder
      }
      const { data } = await this.$axios.get('/api/ownProfile')
      this.userData = data
    },
    async getFoods () {
      const meals = await this.$axios.$get('/api/food')
      this.meals = meals
      // console.log('this.meals in getFoods', this.meals)
    },
    mealType (mealName:any) {
      // console.log(mealName)
      const mealType:any = []
      for (let i = 0; i < this.meals.length; i++) {
        if (this.meals[i].name == mealName && this.meals[i].type && this.meals[i].name !== 'I\'m on Leave') {
          mealType.push(this.meals[i].type)
        // console.log('this is a type ', a.type)
        }
      }
      // console.log('this is mealtype', mealType)
      return mealType.length != 0 ? mealType[0] : 'sabaw'
    },
    // warp 3
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
          }).then(()=> {window.location.href = `${process.env.baseUrl}/confirm`})
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

<style scoped lang="stylus">
  .__user-menu
    display grid
    grid-template-columns 3fr minmax(20rem, 1fr)
    grid-template-rows repeat(5, auto)
    grid-auto-rows auto
    grid-template-areas "text meal-time" "order-options order-summary" "order-options submit-btn"
    grid-gap 1rem 2rem
    +media-screen($max: $breakpoint-sm)
      grid-template-columns 3fr 1fr
      grid-template-rows repeat(3, auto)
      grid-template-areas "text meal-time" "order-options order-options" "order-summary order-summary" "submit-btn submit-btn"
      align-items flex-start
    +media-screen($max: $breakpoint-sm)
      grid-template-columns auto
      grid-template-rows repeat(3, auto)
      grid-template-areas "text" "meal-time" "order-options" "order-summary" "submit-btn"

    .__text
      grid-area text
      h1
        padding-bottom 1rem
      h3
        padding-bottom 1rem
    .__order-options
      grid-area 2/1/-1/1
      +media-screen($max: $breakpoint-sm)
        grid-area order-options
      h1
        margin-bottom 20px
      h3
        margin-bottom 5px
      p
        font-style italic
        margin-bottom 20px
      .__next-week-menu-set-container
        background-color $color-text-alt
        padding 1.25rem
        border-radius $corner-rounding-md
        margin-bottom 1rem
        .card-header
          flexbox($justify: space-between)
          margin-bottom 1rem
          h2
            margin auto 0
            font-weight 500
          .radio-leave-button
            position relative
            width-height 12rem 3.5rem
            background-color blue
            display flex
            color $color-text-alt
            border-radius $corner-rounding-md
            text-shadow: 0 0 2px #333
            cursor pointer
            direction vertical
            border none
            gradient-color vertical, $color-theme3 0%, $color-theme4 90%
            overflow hidden
            &:before
              content ''
              display block
              position absolute 0 0 0 0
              gradient-color slash, $color-theme4 60%, $color-theme3 120%
              opacity 0
              transition opacity 0.2s
              z-index -1
            span, input
              color $color-white
              width @width
              line-height @height
              text-align center
            input
              display none
          .radio-leave-button:hover:before
            opacity 1
          .radio-leave-button input:checked ~ span
            gradient-color slash, $color-theme4 75%, $color-theme3 100%
            border-radius $corner-rounding-md
            display block
        .card-body
          flexbox center space-between row 1rem wrap
          .radio-container
            width-height clamp(8rem, 8rem, 20%) 8rem
            flexbox center center
            border-radius $corner-rounding-md
            cursor pointer
            text-align center
            font-weight bold
            flex 1 1 auto
            +media-screen($max: $breakpoint-md)
              flex 1 1 @width
              &:nth-child(n+4)
                flex-basis calc(50% - 1rem)
            +media-screen($max: $breakpoint-sm)
              &:nth-child(2)
              &:nth-child(3)
              &:first-child
                flex-basis calc(100% / 3 - 2rem)
            +media-screen($max: $breakpoint-xs)
              &:not(:nth-child(3))
                flex-basis calc(50% - 1rem)
              &:nth-child(3)
                flex-basis 100%

            .checkmark
              width-height 100%
              flexbox center center column 1rem
              border-radius @border-radius
              padding 0.5rem
              background-color $color-theme1
              transition background-color 0.2s
            input
              display none
            img
              width-height 5rem 3rem
              margin 0 auto
              filter drop-shadow(0.125rem 0.125rem 0.125rem $color-black)
          .radio-container:hover input ~ .checkmark
            background-color $color-theme3
          .radio-container input:checked ~ .checkmark
            background-color $color-theme3
    .__meal-time
      grid-area meal-time
      flexbox($direction: column, $gap: 0.5rem)
      background $color-white
      padding 1rem
      border-radius $corner-rounding-md
      font-weight bold
    .__order-summary
      grid-area order-summary
      .--ordermenu-container
        display flex
        img
          height 2.5rem
          vertical-align middle
          margin 0 0 1.5rem 0.5rem
      .__order-container
        padding-top 0.5rem
        background-color $color-white
        border-radius $corner-rounding-md
        height 16.5rem
        width 100%
    .__submit-btn
      grid-area submit-btn
      width 100%
      +media-screen($max: $breakpoint-sm)
        justify-self center
        align-self center
        max-width 20rem

// warp 4
  .week-orders
    background-color $color-white
    margin 1rem
    border-radius $corner-rounding-sm
    .satisfy
      text-align center
    table
      padding-top 1.6rem
      .__the-orders
        display inline-flex
        padding-right 1rem
        width 100%
        padding 1rem
        .__the-day
          width 8rem
          text-align left
        .__the-mealtime
          width 5rem
          text-align left
        .__broken-line
          border none
          border-top 3px dotted $color-text-grey
          height 2px
          margin-top 0.4rem
          width 3rem
        .__the-meals
          width 10rem
          text-align right
    .__input
      margin-top 1rem
      flexbox center center row 1rem
  .__chosen-order
    background-color white
    display flex
    gap 1rem
    height 3rem
    width 100%
    padding 1rem
    .broken-line
      border none
      border-top 3px dotted $color-text-grey
      height 2px
      margin-top 0.4rem
      width 3rem
    .--show-day
      width 6rem
    .--chosen-meal
      width 7rem
      text-align right

  .__customize
    display flex
    padding 1.2rem 0 0
    gap 2rem
    .--bold
      font-weight bold
</style>
