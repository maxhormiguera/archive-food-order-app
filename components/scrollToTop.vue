<template>
  <div class="scroll-to-top" :class="{ '--visible': scrollTop }" @click="scrollToTop()"></div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      scrollTop: false,
      main: {} as HTMLElement
    }
  },

  methods: {
    handleScroll () {
      if (process.client && this.main) {
        this.scrollTop = (this.main as HTMLElement).scrollTop > 100
      }
    },
    scrollToTop () {
      this.main?.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }
  },
  created () {
    if (process.client) {
      this.main = document.getElementById('main')!
      this.main?.addEventListener('scroll', this.handleScroll)
    }
  },
  destroyed () {
    if (process.client) {
      this.main?.removeEventListener('scroll', this.handleScroll)
    }
  }
})
</script>
<style lang="stylus" scoped>
.scroll-to-top
  position(fixed, $bottom: 40px, $right: 40px)
  width-height 4.5rem
  background-image '~/assets/images/arrowup.svg'
  z-index $z-index-nav
  border-radius 50%
  opacity 0
  transition opacity 0.8s, box-shadow 1s
  box-shadow 2px 2px 4px $color-border-main
  &:hover
    // box-shadow inset 0 0 4px $color-theme2
    box-shadow 0 0 2px $color-border-main, inset 0 0 4px $color-theme2
  &.--visible
    opacity 1
    transition opacity 2.8s, box-shadow 0.4s
</style>
