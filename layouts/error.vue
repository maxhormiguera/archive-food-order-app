<template>
  <div class="error-main">
    <div class="half-container --glass --error">
      <div class="__page-not-found">
        <h1 v-if="error.statusCode === 404">
          Page not found
        </h1>
        <div v-else class="oops-wrapper">
          <img src="~/assets/images/listeatlogobyms.png" alt="Logo">
          <img src="~/assets/images/error404.png" class="ice-cream" alt="error">
          <h3>Oops, it seems something went wrong :(</h3>
          <NuxtLink to="/">
            <div class="-btn-wrapper">
              <button class="btn-accent1">
                Take Me Home
              </button>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
    <!-- <h1 v-else>Oops... :(</h1>
      <NuxtLink to="/menu">Go back to your menu</NuxtLink>
      <NuxtLink to="/">Home page</NuxtLink> -->
  </div>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  props: ['error']
}
</script>

<style scoped lang="stylus">
.--glass
  border-radius 20px
.error-main
  width-height 100%
  gradient-color horizontal, $color-theme1 0%, $color-theme2 50%
  padding 80px
.half-container
  flexbox center center column 1em
  width 40%
  height 100%
  .oops-wrapper
    display flex
    justify-content center
    text-align center
    align-items center
    flex-direction column
    gap 2rem
    margin 0 auto
    img
      height 5rem
      width 15rem
    .ice-cream
      height 18rem
      width 23rem
    .btn-accent1
      width 20rem

</style>
