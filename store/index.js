import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export const state = () => ({
  counter: 0,
  currentUser: null
})

export const getters = {
  getCounter (state) {
    return state.counter
  },
  getUser (state) {
    return state.currentUser ? state.currentUser : null
  }
}

export const mutations = {
  increment(state) {
    state.counter++
  },
  setUser (state, payload) {
    console.log('::: ?')
    console.log('::: payload ', payload)
    state.currentUser = payload
  }
}

export const actions = {
  // eslint-disable-next-line require-await
  async fetchCounter ({ state }) {
    // make request
    const res = { data: 10 }
    state.counter = res.data
    return res.data
  },
  setUser ({ commit }) {
    commit('setUser', payload)
  }
}
