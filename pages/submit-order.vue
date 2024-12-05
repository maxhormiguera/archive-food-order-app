<template>
  <div class="wrapper">
    <img src="~/assets/images/ordersubmitted.svg" alt="confirm">
    <div class="--wrapper">
      <NuxtLink to="/order-history">
        <button class="btn-accent1">
          Order History
        </button>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="stylus">
  .wrapper
    display flex
    justify-content center
    flex-direction column
    align-items center
    gap 3rem
    img
      width 50rem
      height 30rem
    .btn-accent1
      width 30rem
</style>
