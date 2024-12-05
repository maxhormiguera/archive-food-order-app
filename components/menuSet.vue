<template>
  <div class="__week-orders-placeholder --paper">
    <div v-for="(menuDay, index) in menuWeek" :key="index" class="__day-menu">
      <div
        class="__label"
        :class="selector ? '--selector' : ''"
        @click="selector ? emitMenuDay(menuDay) : null"
      >
        <span class="__label-day">{{ menuDay.date.toString().split(' ')[0] }}</span>
        <span class="__label-date">{{ menuDay.date.getDate() }}</span>
      </div>
      <div class="__menu-list">
        <p v-for="(meal, idx) in menuDay.menu" :key="idx">
          <button v-if="selector" class="remove" @click="removeMeal(idx, meal.title,menuDay.date)">
            X
          </button>{{ meal.title }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    dates: Array,
    selector: Boolean,
    newMenuWeek: Object,
    allMenus: Array,
    isEdit: Boolean
  },
  data () {
    return {
      menus: new Array()
    }
  },
  async fetch () {
    this.menus = await this.$http.$get('http://localhost/api/menu')
    console.log(':::: menus :( ', this.menus)
  },
  computed: {
    menuWeek (): Object {
      return this.dates?.map((d, idx) => {
        return {
          date: d,
          menu: this.getMenu(d),
          cutOff: null, // default
          holiday: false // default
        }
      })
    }
  },
  fetchOnServer: false,
  fetchKey: 'menu-set',
  mounted () {
    console.log(':::: menus in menuSet ', this.menus)
  },
  methods: {
    emitMenuDay (menuDay: Object) {
      this.$emit('menuDaySelected', menuDay)
    },
    log () {
      console.log('::: menuweek', this.menuWeek)
      console.log('::: dates ', this.dates)
    },
    getMenu (date: any) {
      // ::: to later replace with fetch or get api
      // ::: in prod, this gets based on week tather than per day but we can change that later
      const tempMeals:any = []
      console.log('this is for this.selector in menuSet', this.selector)
      if (this.selector === false && this.allMenus) {
        const menuDatesTemp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

        date = date.toString().split(' ')[2]
        console.log('-------', this.allMenus)
        this.allMenus.forEach((eachMenu:any) => {
          eachMenu.menu.forEach((x:any) => {
            let xDate = x.date
            xDate = xDate?.slice(0, 10)
            if (xDate == menuDatesTemp) {
              x.name.forEach((y:any) => {
                (y.name != 'I\'m on leave') &&
                tempMeals.push({ title: `${y.name}`, type: '' })
              })
            }
          })
        })
        // date = date.toString().split(' ')[2]
        return tempMeals
      } else if (this.selector == true && this.newMenuWeek) {
        const menuDatesTemp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

        this.newMenuWeek.meals.forEach((x:any) => {
          if (x.mealDate === menuDatesTemp) {
            x.meals.forEach((y:any) => {
              (y.name !== 'I\'m on leave') &&
              tempMeals.push({ title: y.name, type: '' })
            })
          } else if (typeof x.mealDate === 'string') {
            const tempDate = x.mealDate.slice(0, 10)
            if (tempDate == menuDatesTemp) {
              x.meals.forEach((y:any) => {
                (y.name != 'I\'m on leave') &&
                tempMeals.push({ title: y.name, type: '' })
              })
            }
          }
        })
        date = date.toString().split(' ')[2]
        return tempMeals
      }
    },
    removeMeal (idx:any, food:String, date:Date) {
      const tempFood = {
        idx,
        food,
        date
      }
      this.$emit('foodToRemove', tempFood)
    }
  }
})
</script>

<style scoped lang="stylus">
  .__week-orders-placeholder
    width 100%
    padding 2.85rem 2.85rem 2.85rem 1.85rem
    font-weight bold
    font-size 1.125rem
    border-radius 10px
    background-color white
    .__day-menu
      flexbox($gap:1rem)
      border-radius 1rem 0 0 1rem
    .__label
      flexbox($direction:column, $gap: 1.25rem)
      width 6.25rem
      border-right 4px solid $color-theme3
      flex 0 0 @width
      padding 1rem 0 0 1rem
      .__label-day
        color $color-text-grey
      &.--selector
        transition background-color 0.4s
        cursor pointer
        &:hover
          background-color rgba($color-theme3, 0.4)
    .__menu-list
      flexbox($direction: column, $gap: 0.25rem)
      margin 0 auto
      padding 1rem 0
      p
        display block
        width 160.5px
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
      .remove
        border none
        background transparent
        font-weight bold
        cursor pointer
        margin-right 0.5rem
</style>
