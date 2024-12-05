<template>
  <div class="wrapper">
    <h1>PROFILE</h1>
    <div class="profile --paper">
      <div class="image-profile">
        <img src="~/assets/images/Diversity Avatar_Boy 07.svg" alt="profile">
      </div>
      <div class="details-profile">
        <h1>{{ currentUser.fullName }}</h1>
        <span>{{ currentUser.email }}</span>
        <!-- <span>{{ user.userType }} / {{ user.department }}</span> -->
        <span>MedVision</span>
      </div>
    </div>

    <div class="select">
      <select id="shift" name="shift">
        <option value="day">
          Day Shift
        </option>
        <option value="night">
          Night Shift
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

// type currentUser = {
//   createdAt: String,
//   email: String,
//   familyName: String,
//   fullName: String,
//   givenName: String,
//   updatedAt: String,
//   userType: String,
//   _v: any,
//   _id: String,
//   orders: Array<any>[]
// }

export default Vue.extend({
  data () {
    return {
      currentUser: {}
    }
  },
  // computed: {
  //   user () {
  //     return this.$store.getters.getUser
  //   }
  // },
  mounted () {
    // console.log(':::: user ', this.user);
    this.getUser()
  },
  methods: {
    async getUser() {
      const { data } = await this.$axios.get(`/api/ownProfile`)
      console.log('data in usertype nav', data)
      // console.log('data in usertype nav', data.userType)
      this.currentUser = data
    }
  }
})
</script>

<style scoped lang="stylus">
  .wrapper
    display block
    .select
      width clamp(40%, 44rem, 100%)
    .profile
      display flex
      gap 1rem
      width clamp(40%, 44rem, 100%)
      margin 1rem 0
      border-radius $corner-rounding-md
      .image-profile
        padding 1rem
        img
          height 15rem
          width 15rem
      .details-profile
        text-align left
        display flex
        flex-direction column
        margin auto 0
        h1,span
          padding-bottom 5px
</style>
