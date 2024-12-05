<template>
  <div class="__confirm-container">
    <img src="~/assets/images/orderconfirmed.svg" alt="">
    <Nuxt-Link to="/">
      <button class="btn-accent1 --homepage">
        Back to Homepage
      </button>
    </Nuxt-Link>
  </div>
</template>

<style scoped lang="stylus">
  .__confirm-container
    background-color transparent
    display flex
    flex-direction column
    justify-content center
    align-items center
    gap 2rem
    img
      width 50rem
      height 30rem
    .--homepage
      width 30rem
</style>
