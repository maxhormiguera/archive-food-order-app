<template>
  <ul class="navigation" :class="burgered ? '--active' : ''">
    <li class="__burger" :class="burgered ? '--active' : ''" @click="burgered = !burgered">
      <span />
      <span />
      <span />
    </li>
    <li v-for="navItem in userType === 'Admin' ? adminNavItems : employeeNavItems" :key="navItem.link">
      <NuxtLink :to="`${navItem.link}`" class="__nav-item">
        {{ navItem.text }}
      </NuxtLink>
    </li>
  </ul>
</template>
<script lang="ts">
import { anyTypeAnnotation } from '@babel/types'


export default {
  name: 'Navigation',
  data () {
    return {
      userType: '',
      burgered: false,
      adminNavItems: [
        {
          text: 'Menu',
          link: '/menu'
        },
        {
          text: 'Meals',
          link: '/meals'
        },
        {
          text: 'Orders',
          link: '/orders'
        },
        {
          text: 'Users',
          link: '/users'
        },
        {
          text: 'Profile',
          link: '/profile'
        },
        {
          text: 'Theme',
          link: '/standards'
        },
        {
          text: 'Logout',
          link: '/auth/logout'
        }
      ],
      employeeNavItems: [
        {
          text: 'Menu',
          link: '/'
        },
        {
          text: 'Order History',
          link: '/order-history'
        },
        {
          text: 'Profile',
          link: '/profile'
        },
        {
          text: 'Theme',
          link: '/standards'
        },
        {
          text: 'Logout',
          link: '/auth/logout'
        }
      ]
    }
  },
  // computed: {
    // async userType () {
      // return 'Admin'
      // console.log('asa naman ang getters oy!', this.$store.state.currentUser)
      // return this.$store
      // return this.$store.getters.getUser.userType || 'Employee'
  //   }
  // },
  mounted() {
    this.getUserType()
  },
  methods: {
    async getUserType() {
      const { data } = await this.$axios.get(`/api/ownProfile`)
      // console.log('data in usertype nav', data)
      // console.log('data in usertype nav', data.userType)
      this.userType = data.userType
    }
  }
}
</script>
<style scoped lang="stylus">
.navigation
  flexbox center flex-end row 2rem
  flex 1
  $bottom-border-width = 6px
  .__burger
    display none
    position relative
    flex 0 0 auto
    align-self center
    width-height 5.5rem 2.75rem
    >span
      width-height 3.5rem 0.35rem
      display block
      gradient-color horizontal, $color-theme3 0%, $color-theme4 100%
      border-radius 0.25rem
      transition transform 0.4s, opacity 0.4s, top 0.4s
      transform translate(-50%, -50%)
      position(absolute, 50%, $left: 50%)
      &:first-child
        top calc(50% - 0.7125rem)
      &:nth-child(3)
        top calc(50% + 0.7125rem)

  .__nav-item
    font-size 1.2rem
    position relative
    font-weight bold
    &:after
      content ''
      position($position: absolute, $top:calc(100% + 4px), $left: -2px)
      display block
      background-color $color-theme1
      border-radius $bottom-border-width
      width-height 0 $bottom-border-width
      transition width 0.4s, height 0.4s, background 0.4s, box-shadow 0.4s
    &:hover:after
      background-color $color-theme3
      width calc(100% + 4px)
    &.nuxt-link-exact-active::after
      background-color $color-theme2
      gradient-color horizontal, $color-theme3 0%, $color-theme4 100%
      width calc(100% + 4px)
  +media-screen($max: $breakpoint-sm)
    position absolute 30px 50px
    flexbox flex-end flex-start column 1rem
    transition max-height 1s ease-in
    margin 0
    padding 1rem 2rem
    max-height 4.5rem
    overflow hidden
    z-index $z-index-nav
    &:before
      content ''
      display block
      width-height 100%
      position absolute 0 0 0 0
      border-radius 20px
      transition background-color 0.8s ease-in, box-shadow 0.8s
    .__nav-item
      font-size 1.5rem
    .__nav-item:after
      position(absolute, $top: calc(50% - 6px), $left: -1.5rem)
    .__nav-item.nuxt-link-exact-active:after
      width-height $bottom-border-width*2
    .__nav-item:hover:after
      width-height $bottom-border-width*2
      box-shadow 0.874rem 0 1rem  $color-theme3
    &.--active
      max-height calc(100vh - 60px)
      transition max-height 1s ease-out
    &.--active:before, &:hover:before
      background-color $color-white
      box-shadow inset 0 0 2px $color-theme2
      transition-timing-function linear
    .__burger
      display block
      &.--active
        span:first-child
          transform translate(-50%, -50%) rotate(45deg)
          position(absolute, 50%, $left: 50%)
        span:nth-child(2)
          opacity 0
        span:nth-child(3)
          transform translate(-50%, -50%) rotate(-45deg)
          position(absolute, 50%, $left:50%)

  +media-screen($max: $breakpoint-xxs)
    position absolute 100px 50%
    transform translateX(50%)
    width calc(100% - 5rem)
    align-items center
    transition max-height 1s ease-in, padding 0s linear 1s, gap 0s linear 1s
    &.--active
      transition max-height 1s ease-out, padding 0.2s, gap 0s linear 0s
    &:not(.--active)
      padding 0 2rem
      gap 2rem
      &:before
        height calc(100% - 1.75rem)
        transition height 0s linear 1s
</style>
