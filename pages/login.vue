<template>
  <div class="user-login --glass">
    <div class="__pane half-spill-container">
      <div class="__container">
        <!-- <lottie-player autoplay loop mode="normal" src="~/assets/animations/login-animation.json"></lottie-player> -->
        <lottie-player autoplay loop mode="normal" src="https://assets2.lottiefiles.com/packages/lf20_l8kuy39u.json" />
      </div>
    </div>
    <div class="__pane --glass half-spill-container">
      <div class="__container">
        <div class="__branding-signin">
          <img src="~/assets/images/loginlogo.svg" alt="logo" class="__logo">
          <button class="btn-google">
            <!-- <a href="http://localhost:8080/auth/google"></a> -->
            <a href="/auth/google"></a>
            <span>Sign in with Google</span>
          </button>
        </div>
        <p class="__bottom-text">
          © 2022 All Rights Reserved | MedSpecialized, Inc. | LMC Team
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'LoginPage',
  layout: 'empty'
})
</script>

<style scoped lang="stylus">
.__container
  padding 4.285rem 0
.user-login
  width-height 100%
  flexbox stretch
  gradient-color horizontal, $color-theme1 0%, $color-theme2 50%
  &:before
    display none
  .__pane
    flex 1 1 50%
    .__container
      flexbox center center column
      height 100%
    .__branding-signin
      flexbox center center column 6.875rem
      flex 1
  .__logo
    width clamp(50%, 24rem, calc(100% - 2.5rem))
  +media-screen($max: $breakpoint-sm)
    flexbox stretch flex-start column-reverse
    &:before
      display block
    .__pane:last-child
      flex 1 1 100%
      &:before
        display none
    .__pane:first-child
      position absolute false 0 0 0
      .__container
        max-width unset
        width clamp(32rem, 50rem, calc(100% - 16rem))

    .__container
      margin auto
    .btn-google
      box-shadow 0 0 0.5rem rgba($color-black, 0.25)


.btn-google
  flexbox($align: center, $justify: center, $gap: clamp(0.5rem, 1rem, 2rem))
  width-height clamp(50%, 16rem, calc(100% - 2rem)) 3.75rem
  position relative
  border none
  border-radius @height
  font-size 1.2rem
  background-color $color-white
  padding 0.25rem 1rem
  white-space nowrap
  >a
    position absolute 0 0 0 0
    border-radius @border-radius
  &::before
    content: ''
    display block
    width-height clamp(1.4rem, 1.6rem, 1.875rem)
    background-image '~assets/images/google-icon.svg' contain
    flex 0 0 @width
</style>
