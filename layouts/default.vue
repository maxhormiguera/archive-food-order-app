<template>
  <main id="main">
    <Scroll-To-Top />
    <div class="container --glass">
      <div class="__header">
        <img src="~/../assets/images/listeatlogo.png" alt="logo" class="__logo" />
        <Navigation/>
        <!-- <userNavigation></userNavigation> -->
      </div>
      <Nuxt class="__content" />
    </div>

  </main>
</template>


<style scoped lang="stylus">
main
  gradient-color horizontal, $color-theme1 0%, $color-theme2 50%
  padding 30px 60px 0
  overflow-y auto
  +media-screen($max: $breakpoint-xs)
    padding 0
.container
  display grid
  min-height 100%
  grid-template-rows min-content 1fr
  grid-gap 3rem
  +media-screen($max: $breakpoint-xs)
    border-radius 0
  .__header
    flexbox flex-end space-between
    height 100%
    grid-row 1
    .__logo
      flex 0 0 220px
      width-height 220px auto

    +media-screen($max: $breakpoint-xxs)
      flexbox center flex-start column 1rem
      .__logo
        flex 0 0 auto
  .__content
    grid-row 2
</style>
