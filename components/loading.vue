<template>
  <div class="error-main" v-if="loading"> 
    <div class="half-container --glass --error">
      <div class="__page-not-found">
        <div class="oops-wrapper">
          <img src="~/assets/images/listeatlogobyms.png" alt="Logo">
          <div class="animation-container">
            <lottie-player autoplay loop mode="normal" src="https://assets2.lottiefiles.com/packages/lf20_yjivypus.json" />
          </div>
          <h3>One Moment, Please Wait....</h3>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Vue from 'vue'

export default Vue.extend({
  layout: 'empty',
  data () {
    loading: false
  },
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    }
  }
})

</script>

<style scoped lang="stylus">
.--glass
  border-radius $corner-rounding-lg
.error-main
  width-height 100%
  gradient-color horizontal, $color-theme1 0%, $color-theme2 50%
  padding 80px
.half-container
  flexbox center center column 1em
  width 40%
  height 100%
  .oops-wrapper
    flexbox($justify: center, $align: center, $direction: column, $gap: 2rem)
    text-align center
    gap 2rem
    margin 0 auto
    img
      height 6rem
      width 15rem
      margin-bottom 15rem
      @media screen and (min-width: $breakpoint-md)
        transform translateY(-1rem)
        width 13rem
        height 5.8rem
      @media screen and (min-width: $breakpoint-lg)
        transform translateY(-8rem)
        width 20rem
        height 9rem
    .btn-accent1
      width 20rem
    .animation-container
      transform translateY(1.5rem)
      height 18rem
      width 23rem
      position absolute
      @media screen and (min-width: $breakpoint-md)
        height 16rem
        width 21rem
      @media screen and (min-width: $breakpoint-lg)
        height 28rem
        width 33rem
      lottie-player
        position: absolute;
        top: 0;
        bottom: 0;
        left:0;
        right: 0;
        z-index: -1;
    h3
      @media screen and (min-width: $breakpoint-lg)
        transform translateY(6rem)
</style>
