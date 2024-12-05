<template>
  <client-only>
    <v-date-picker
    v-model="sd"
    class="v-cal --paper"
    is-expanded
    is-required
    title-position="left"
    :attributes="attr"
    @input="getWeekOf()"
    />
  </client-only>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'CalendarWeekly',
  props: [
    'selectedDate',
    'selectedRange'
  ],
  data () {
    return {
      sd: this.selectedDate,
      attr: [
        {
          key: 'today',
          dot: 'red',
          popover: {
            label: 'Today'
          },
          dates: ''
        },
        {
          key: 'thisweek',
          highlight: 'purple',
          popover: {
            label: "This week's menu"
          },
          dates: {}
        }
      ]
    }
  },
  mounted () {
    this.getWeekOf()
  },
  methods: {
    getWeekOf () {
      const today = new Date()
      const curr = this.sd
      const newRange = {
        start: new Date(curr),
        end: new Date(curr),
        weekNumber: 0,
        dates: new Array()
      }

      newRange.start.setDate(curr.getDate() - curr.getDay() + 1)
      newRange.end.setDate(curr.getDate() - curr.getDay() + 5)
      newRange.weekNumber = this.getWeekNumber(curr)
      newRange.dates = this.getDatesInRange(newRange)

      // ::: set dates to styling attributes
      this.attr.map((a) => {
        if (a.key === 'today') {
          a.dates = today.toDateString()
        }
        if (a.key === 'thisweek') {
          a.dates = newRange
        }
      })

      // ::: set dateRange text from new date range
      this.$emit('update:selectedRange', newRange)
    },
    getWeekNumber (curr: Date) {
      return Math.ceil(Math.floor((+curr - +new Date(curr.getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000)) / 7) + 1
    },
    getDatesInRange ({ start, end }: {
      start: Date;
      end: Date;
    }) {
      for (var arr = new Array<Date>, dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
        arr.push(new Date(dt))
      }
      return arr
    }
  }
})
</script>
<style lang="stylus">
.vc-day.is-not-in-month
  .vc-day-layer
    opacity 1 !important
  .vc-day-content
    opacity 0.25 !important
  .vc-highlight
    opacity 1 !important
</style>
