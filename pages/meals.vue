<!-- eslint-disable no-unused-expressions -->
<template>
  <div>
    <div v-if="show == 'Meals'" class="wrapper">
      <div class="header-wrapper">
        <h1>Meals ({{ meals?.length }})</h1>
        <div class="__tools">
          <label class="checkbox">
            <input v-model="selectAll" type="checkbox" name="select" @change="selectAllToggle()">
            <span class="__box" />
            <strong class="__label">Select All</strong>
          </label>
          <button class="btn-accent2" @click="isModalActive = !isModalActive">
            Delete Meal
          </button>
          <Modal :active.sync="isModalActive" message="Are you sure you want to delete this meal?" type="warning" @confirmed="deleteMeals()" />
          <button class="btn-accent1" @click="show = 'AddMeal'">
            Add Meal
          </button>
        </div>
      </div>

      <div class="meals-wrapper">
        <div v-for="meal in meals" :key="meal._id" class="__meal">
          <img v-lazy-load :src="imageSrc(meal.type)" alt="dessert">
          <div class="__label">
            <p for="porkchop">
              {{ meal.name }}
            </p>
            <span>{{ meal.type }}</span>
          </div>
          <div class="__actions">
            <i class="ico-btn-edit" role="button" @click="editMeals(meal._id)" />
            <label class="checkbox">
              <input v-model="meal.selected" type="checkbox" name="select">
              <span class="__box" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <div v-if="show == 'AddMeal'" class="wrapper">
      <h1>MEALS</h1>
      <div class="add-meal_wrapper">
        <div class="name_section">
          <div class="input-group">
            <label>Menu Title</label>
            <input v-model="newMeal.name" type="text" class="input">
          </div>
          <div class="input-group">
            <label for="category">Category</label>
            <div class="select">
              <select v-model="newMeal.category" name="category">
                <option value="dessert">
                  Dessert
                </option>
                <option value="fruits">
                  Fruits
                </option>
                <option value="vegetables">
                  Vegetables
                </option>
                <option value="fish">
                  Fish
                </option>
                <option value="pork">
                  Pork
                </option>
                <option value="chicken">
                  Chicken
                </option>
              </select>
            </div>
          </div>
          <div class="button-wrapper">
            <button class="btn-accent2" @click="show = 'Meals'">
              Back
            </button>
            <button class="btn-accent1" @click="isModalActive = !isModalActive">
              Save
            </button>
            <Modal v-if="isEdit == false" :active.sync="isModalActive" message="Successfully Submitted" type="success" @confirmed="addMeals()" />
            <Modal v-if="isEdit == true" :active.sync="isModalActive" message="Meal Updated Successfully" type="success" @confirmed="saveMeals()" />
          </div>
        </div>
        <div class="image_section --paper">
          <div class="for_background">
            <img :src="imageSrc(newMeal.category)" alt="pork">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { data } from 'browserslist'
import Vue, { onDeactivated } from 'vue'

type Meal = {
  _id: string,
  name: string,
  type: string,
  selected?: boolean
}

export default Vue.extend({
  data () {
    return {
      selectAll: false,
      isEdit: false,
      newString: '',
      isModalActive: false,
      meals: new Array<Meal>(),
      show: 'Meals',
      newMeal: {
        _id: '',
        name: '',
        category: 'pork'
      }
    }
  },
  async mounted () {
    this.getFoods()
    // console.log('user ? in mounted meals ::: ', this.$store.state.currentUser)
  },
  methods: {
    // add the meals
    async addMeals () {
      console.log('Title:', this.newMeal.name)
      console.log('Category:', this.newMeal.category)

      await this.$axios.$post('/api/food', {
        name: this.newMeal.name,
        type: this.newMeal.category
      })
      window.location.href = `${process.env.baseUrl}/meals`
    },
    editMeals (id:any) {
      console.log(id)
      const foundMeals:any = this.meals.find((a:any) => {
        return a._id === id
      })
      this.newMeal.name = foundMeals.name
      this.newMeal.category = foundMeals.type
      this.newMeal._id = foundMeals._id

      this.show = 'AddMeal'
      this.isEdit = true
    },
    async saveMeals () {
      if (this.isEdit === false) {
        await this.$axios.post('/api/food', {
          name: this.newMeal.name,
          type: this.newMeal.category
        })
      } else {
        const update:any = {
          name: this.newMeal.name,
          type: this.newMeal.category,
          description: '',
          _id: this.newMeal._id
        }
        console.log(update)

        await this.$axios.$put(`/api/food/${update._id}`, update)
        window.location.href = `${process.env.baseUrl}/meals`
      }

      this.show = 'Meals'
      this.isEdit = false
    },
    imageSrc (meal:string) {
      return meal ? require(`~/assets/images/category/${meal}.svg`) : require('~/assets/images/category/sabaw.svg')
    },
    selectAllToggle () {
      this.meals.map((meal) => {
        meal.selected = this.selectAll
      })
    },
    onConfirm () {
      this.$emit('confirmed')
      this.$emit('update:active', false)
    },
    // getting the meals
    async getFoods () {
      const meals = await this.$axios.$get('/api/food')
      this.meals = meals
    },
    // deleting the meals
    async deleteMeals () {
      const deleteFood = new Array<string>()
      if (this.meals.length != 0) {
        this.meals.forEach((meal:Meal) => {
          if (meal.selected === true) {
            deleteFood.push(meal._id)
          }
        })
      }
      await this.$axios.$post('/api/deleteMeal', {
        toDelete: deleteFood
      })
      window.location.href = `${process.env.baseUrl}/meals`
    }
  }
})
</script>

<style scoped lang="stylus">
  .header-wrapper
    flexbox($gap: 1rem, $justify: space-between, $align: center)
    margin-bottom: 1.25rem
    .__tools
      flexbox($gap: 1rem)
    +media-screen($max: $breakpoint-xs)
      flex-wrap wrap
      h1
        flex 1 0 100%
      .__tools
        flex 1 0 100%
      .checkbox
        flex 1
        order 3
        justify-content flex-end

  .meals-wrapper
    flexbox($gap:1rem, $wrap: wrap)
    .__meal
      flexbox(center, space-between, $gap: 3rem)
      flex 1 1 clamp(28rem, calc(33% - 1em), 100%)
      background-color $color-white
      height 10.5rem
      padding 1rem
      border-radius $corner-rounding-sm
      .__label
        flex 1
        text-align center
        width clamp(12rem, 100%, 22rem)
        p
          word-break break-word
          hyphens auto
          font-weight bold
      .__actions
        flexbox($align: center, $gap: 1rem)
        align-self flex-start
      img
        height 5rem
        width 8rem
      .ico-btn-edit
        cursor pointer

  .add-meal_wrapper
    flexbox($gap: 2rem, $align: flex-start)
    margin-top 2rem
    .name_section
      flex 1 1 12rem
      align-self stretch
      flexbox($gap: 1rem, $direction: column)
      .input-group
        font-weight bold
        font-size 1.125rem
        flexbox($align: center, $gap: 1rem)
        label
          width 9rem
      .input
      .select
        flex 0 1 80%
      .button-wrapper
        flexbox($justify: flex-end, $gap:1rem)
        margin-top auto
    .image_section
      border-radius $corner-rounding-md
      flex 1 1 12rem
      img
        width-height 12rem
        display block
        margin 4rem auto
</style>
