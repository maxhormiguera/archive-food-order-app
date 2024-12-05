<template #submit>
  <Transition name="modal">
    <div v-if="active" class="modal">
      <div class="__backdrop --glass" />
      <div class="__body --paper">
        <slot name="content">
          <img v-if="type" :class="type" :src="imageSrc(type)" alt="warning">
          <h4>{{ message }}</h4>
        </slot>
        <slot name="actions">
          <div class="__input">
            <button :class="cancelBtnClass" @click="$emit('update:active', false)">
              {{ cancelBtnText }}
            </button>
            <button :class="confirmBtnClass" @click="onConfirm">
              {{ confirmBtnText }}
            </button>
          </div>
        </slot>
      </div>
    </div>
    <div v-if="placeOrder" class="modal">
      <div class="__backdrop --glass" />
      <div class="__body --paper">
        <slot name="content">
          <img v-if="type" :class="type" :src="imageSrc(type)" alt="warning">
          <h4>{{ message }}</h4>
        </slot>
        <slot name="actions">
          <div class="__input">
            <button :class="cancelBtnClass" @click="$emit('update:placeOrder', false)">
              {{ cancelBtnText }}
            </button>
            <!-- <Nuxt-Link to="/confirm"> -->
            <!-- <Nuxt-Link> -->
              <!-- <button class="btn-accent1 --homepage" @click="$emit('confirm')"> -->
              <button class="btn-accent1 --homepage" @click="onConfirm">
                Place Order
              </button>
            <!-- </Nuxt-Link> -->
          </div>
        </slot>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Modal',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    placeOrder: {
      type: Boolean,
      default: false
    },
    message: String,
    cancelBtnClass: {
      type: String,
      default: 'btn-accent2'
    },
    cancelBtnText: {
      type: String,
      default: 'Cancel'
    },
    confirmBtnClass: {
      type: String,
      default: 'btn-accent3'
    },
    confirmBtnText: {
      type: String,
      default: 'Ok'
    },
    type: {
      type: String,
      default: null
    }
  },
  methods: {
    onConfirm () {
      this.$emit('confirmed')
      this.$emit('update:active', false)
    },
    imageSrc (type:string) {
      return require(`~/assets/images/${type}.svg`)
    }
  }
})
</script>
w
<style scoped lang="stylus">
  .modal
    flexbox center center
    position fixed 0 0 0 0
    z-index $z-index-modal
    h4
      text-align center
    .__body
      border-radius 0.75rem
      padding 2.85rem 4rem
      flexbox center flex-start column 1rem
      width clamp(24rem, 40rem, 80%)
      overflow hidden
    .__backdrop
      position fixed 0 0 0 0
      &:before
        background-color $color-black
        opacity 0.6
    .__input
      flexbox center center row 1rem
</style>
