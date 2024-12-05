<template>
  <div class="wrapper">
    <div v-if="show === 'usersPage'" class="users-container">
      <div class="__header">
        <h1>USERS</h1>
        <div class="__actions-wrapper">
          <div class="search-wrapper">
            <input v-model="search" type="text" placeholder="Search">
          </div>
          <label class="checkbox">
            <input v-model="selectAll" type="checkbox" name="select" @change="selectAllToggle()">
            <span class="__box" />
            <span class="__label">Select All</span>
          </label>
          <button class="btn-accent2" @click="isModalActive = !isModalActive">
            Delete User
          </button>
          <Modal :active.sync="isModalActive" type="warning" message="Are you sure you want to delete this user?" @confirmed="deleteUser()" />
          <button class="btn-accent1" @click="show = 'addUser'">
            Add User
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th class="__header-name">
              Name
            </th>
            <th>Email</th>
            <th>Shift</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td class="shift">
              {{ user.shift }}
            </td>
            <td class="action">
              <button>
                <img src="~/assets/images/edit.svg" alt="edit">
              </button>
              <label class="checkbox">
                <input v-model="user.isSelected" type="checkbox" name="select">
                <!-- <input type="checkbox" name="select"> -->
                <span class="__box" />
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="show === 'addUser'" class="add-user-container">
      <div class="header">
        <h1>ADD USER</h1>
      </div>
      <div class="body">
        <div class="cln-1">
          <div class="input-container">
            <label for="name">Name</label>
            <input v-model="newUser.name" class="input" type="text" placeholder="Name">
          </div>
          <div class="input-container">
            <label for="email">Email</label>
            <input v-model="newUser.email" class="input" required type="email" placeholder="Email">
          </div>
          <div class="input-container">
            <label for="userType">User Type</label>
            <div class="select">
              <select v-model="newUser.userType" required>
                <option value="Employee">
                  Employee
                </option>
                <option value="Admin">
                  Admin
                </option>
              </select>
            </div>
          </div>
          <div class="input-container">
            <label for="department">Department</label>
            <div class="select">
              <select v-model="newUser.department">
                <option v-for="dep in departmentOptions" :value="dep">
                  {{ dep }}
                </option>
                <option value="Medvision">
                  Medvision
                </option>
                <option value="Dr. Catalyst">
                  Dr. Catalyst
                </option>
              </select>
            </div>
          </div>
          <div class="input-container">
            <label for="department">Gender</label>
            <div class="select">
              <select v-model="newUser.gender">
                <option value="Male">
                  Male
                </option>
                <option value="Female">
                  Female
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="cln-2">
          <img :src="imgURL" alt="profilegirl">
          <div class="btn-container">
            <button class="btn-accent2" @click="show = 'usersPage'">
              Back
            </button>
            <button class="btn-accent1" @click="addNewUser()">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { compileFunction } from 'vm'
import { json } from 'body-parser'
import { data } from 'browserslist'
import Vue from 'vue'

type User = {
  _id: string,
  name: string,
  email: string,
  userType: string,
  isSelected?: boolean,
  department: string,
  shift: string,
  gender: string
}

export default Vue.extend({
  data () {
    return {
      imgURL: require('~/assets/images/profilegirl.svg'),
      isModalActive: false,
      users: new Array<User>(),
      selectAll: false,
      search: '',
      show: 'usersPage',
      newUser: {
        id: '',
        name: '',
        email: '',
        userType: '',
        department: '',
        gender: ''
      },
      departmentOptions: ['Meditab', 'Drcatalyst', 'SuiterX', 'Quickcap', 'MedPharmServices', 'MedVision', 'ErTech']
    }
  },
  computed: {
    filteredUsers () {
      return (this.users.filter((user) => {
        return (
          (user.name.toLowerCase().includes(this.search.toLowerCase()) ||
          user.email.toLowerCase().includes(this.search.toLowerCase()) ||
          user.shift.toLowerCase().includes(this.search.toLowerCase())) && user
        )
      }))
    }
  },
  mounted () {
    this.getUsers()
  },
  methods: {
    // for select all function
    selectAllToggle () {
      this.users.map((user) => {
        user.isSelected = this.selectAll
      })
    },
    // getting the users data
    async getUsers () {
      // console.log('Below is the fetch req')
      const tempUsers = await this.$axios.get('/api/user')
      const tempUsers2 = tempUsers.data.map((oneData:any) => {
        return ({
          _id: oneData._id,
          name: oneData.fullName,
          email: oneData.email,
          shift: oneData.shift ? oneData.shift : '',
          isSelected: false,
          userType: oneData.userType,
          department: oneData.department,
          gender: oneData.gender || ''
        })
      })
      this.users = tempUsers2
      console.log('mwaaps')
    },
    // to add the user function
    async addNewUser () {
      console.log(this.newUser)
      this.newUser.name !== '' &&
      (
        await this.$axios.post('/api/user', {
          name: this.newUser.name,
          email: this.newUser.email,
          userType: this.newUser.userType,
          department: this.newUser.department,
          gender: this.newUser.gender
        })
      )
      console.log(`new user posted`)
      window.location.href = `${process.env.baseUrl}/users`
    },
    // delete the selected user function
    deleteUser () {
      const selectedUsers = this.users.filter((u:User) => u.isSelected === true)
      console.log(selectedUsers)

      const selectedIds:Array<string> = selectedUsers.length !== 0
        ? selectedUsers.map((selectedUser) => {
          return selectedUser._id
        })
        : []

      selectedUsers.forEach(async (selectedUser:User) => {
        await this.$axios.delete(`/api/user/${selectedUser.email}`, {
          data: {toDelete: selectedIds}
        })
      })
      window.location.href = `${process.env.baseUrl}/users`
    }
  }

})
</script>

<style scoped lang = "stylus">
  .wrapper
    display block
    padding 1rem
    grid-gap 1.25rem

  h1
    margin-bottom 1.5rem

  .__actions-wrapper
    flexbox center flex-start row 2rem
    margin-bottom 1.2rem
    position sticky
    .search-wrapper
      flex 1 1 auto

  table
    width 100%
    border-collapse collapse
    border-radius $corner-rounding-md
    overflow hidden
    th
      background $color-theme3
      color $color-text-alt
      text-align center
      padding 1rem
      &:not(:last-child)
        border-right 1px solid black
    .__header-name
      text-align left
    tbody
      background $color-text-alt
      .shift, .action
        text-align center
      td:not(:last-child)
        border-right 1px solid black
      td
        padding 1rem
      .action
        button
          border none
          background transparent
          &:hover
            cursor pointer
          img
            height 1rem
            width 1rem
            vertical-align middle
        label
          vertical-align middle

  .add-user-container
    .body
      display flex
      justify-content space-between
      gap 5%
      .cln-1
        font-weight bold
        width 100%
        .input-container
          display flex
          justify-content space-between
          margin 1rem 0 0 1.5rem
          label
            margin auto 0
          .input, .select
            width 80%
      .cln-2
        width 100%
        margin-top 1rem
        img
          border-radius $corner-rounding-md
          background $color-white
          display block
          margin auto
          height 18.1rem
          width 100%
      .btn-container
          display flex
          margin-top 1.25rem
          gap 1rem
          justify-content flex-end
</style>
