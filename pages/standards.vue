<template>
  <div class="standards">
    <div>
      <h1>Standards</h1>
      <p>For themed inputs, buttons, modals, common ui components.</p>
    </div>
    <div class="__group">
      <input class="input" placeholder="Regular input text">
      <input class="input" placeholder="Disabled input text" disabled>
      <div class="search-wrapper">
        <input type="text" class="input" placeholder="Search">
      </div>
      <div class="select">
        <select>
          <option value="1">
            One
          </option>
          <option value="2">
            Two
          </option>
          <option value="3">
            Three
          </option>
          <option value="4">
            Four
          </option>
        </select>
      </div>
    </div>

    <div class="__group">
      <label class="checkbox">
        <input type="checkbox" name="select">
        <span class="__box" />
        <span class="__label">Check One</span>
      </label>
      <label class="checkbox">
        <input type="checkbox" name="select">
        <span class="__box" />
        <span class="__label">Check Two</span>
      </label>
      <label class="checkbox">
        <input type="checkbox" name="select">
        <span class="__box" />
        <span class="__label">Check Three</span>
      </label>
      <label class="checkbox">
        <input type="checkbox" name="select">
        <span class="__box" />
        <span class="__label">Check Four</span>
      </label>
    </div>

    <div class="__group">
      <button class="btn-accent1">
        Accent 1
      </button>
      <button class="btn-accent2">
        Accent 2
      </button>
      <button class="btn-accent3">
        Accent 3
      </button>
      <button class="btn-ghost1">
        Ghost1
      </button>
      <button class="btn-ghost2">
        Ghost2
      </button>
    </div>

    <div class="__group">
      <label class="radio">
        <input type="radio" name="coconuts">
        <span class="__circle" />
        <span class="__label">First Option</span>
      </label>
      <label class="radio">
        <input type="radio" name="coconuts">
        <span class="__circle" />
        <span class="__label">Second Option</span>
      </label>
      <label class="radio">
        <input type="radio" name="coconuts">
        <span class="__circle" />
        <span class="__label">Third Option</span>
      </label>
      <label class="radio">
        <input type="radio" name="coconuts">
        <span class="__circle" />
        <span class="__label">Fourth Option</span>
      </label>
    </div>

    <div class="__group">
      <button class="btn-accent1" @click="isModalActive = !isModalActive">
        Open Modal
      </button>
      <Modal :active.sync="isModalActive" message="This modal wants to tell you something. Something very important. Hi. " @confirmed="modalOpenCounter" />
      <p>I've been confirmed {{ modalConfirmed }} time(s)</p>
    </div>

    <div class="__group">
      <Calendar-Weekly :selected-date="date" :selected-range.sync="selectedRange" />
      <div class="from-calendar --paper">
        <p>Selected Range</p>
          <ul>
            <li>
              <strong>Start</strong>
              {{ selectedRange.start.toDateString() }}
            </li>
            <li>
              <strong>End</strong>
              {{ selectedRange.end.toDateString() }}
            </li>
            <li>
              <strong>Week Number</strong>
              {{ selectedRange.weekNumber }}
            </li>
            <li>
              <strong>Dates</strong>
              <ul>
                <li v-for="d in selectedRange.dates">{{ d.toDateString() }}</li>
              </ul>
            </li>
          </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      isModalActive: false,
      modalConfirmed: 0,
      date: new Date,
      selectedRange: {
        start: new Date(),
        end: new Date(),
        weekNumber: 0,
        dates: new Array()
      }
    }
  },
  methods: {
    modalOpenCounter () {
      this.modalConfirmed++
    }
  },
})
</script>
<style lang="stylus" scoped>
.standards
  flexbox flex-start flex-start column 2rem
  position relative
  .__group
    flexbox($align: center, $gap:2rem)
    width 100%
.v-cal
  flex 1 1 auto
  min-width unset
.from-calendar
  align-self flex-start
  flex 1 1 auto
  padding 1.5rem 2rem
  border-radius $corner-rounding-md
  >ul
    li
      margin-bottom 0.2rem
    ul
      padding-left 1rem

</style>
