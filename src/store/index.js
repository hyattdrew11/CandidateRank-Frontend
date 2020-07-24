// store/index.js

import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

// imports of AJAX functions will go here
import { authenticate, register, getCandidates } from '@/api'
import { isValidJwt, EventBus } from '@/utils'

Vue.use(Vuex)

const state = {
  user : null,
  candidates: [],
  userData: {},
  jwt: ''
}

const actions = {
  
  login (context, userData) {
    context.commit('setUserData', { userData })
    return authenticate(userData)
      .then((response) => {
        context.commit('setJwtToken', { jwt: response.data })
        EventBus.$emit('authenticated', 'Sucessful login')
      })
      .catch(error => {
        EventBus.$emit('failedAuthentication', 'Error logging in please try again.')
      })
  },
  register (context, userData) {
    context.commit('setUserData', { userData })
    return register(userData)
    .then((response) => {
          window.location.href =  "https://zoom.us/oauth/authorize?response_type=code&client_id=k6uY18lSSjqNNenR0lspOg&redirect_uri=https://candidaterank.io/zoomredirect"
    })
    .catch(error => {
        EventBus.$emit('failedRegistering: ', error)
    })
  },
  loadCandidates (organization) {
    return getCandidates(organization)
    .then((response) => {
        context.commit('setCandidates', { candidates: response })
      })
  }
}

const mutations = {
  setCandidates (state, payload) {
    state.candidates = payload.candidates
  },
  setUserData (state, payload) {
    state.user = payload.userData
    localStorage.user = payload.userData
  },
  setJwtToken (state, payload) {
    localStorage.token = payload.jwt.token
    localStorage.user = payload.jwt.token.user
    state.jwt = payload.jwt
    state.user = payload.jwt.token.user
  }
}

const getters = {
  isAuthenticated (state) {
    if(state.jwt) {
      return isValidJwt(state.jwt.token)
    }
    return false
  }
}

const store = new Vuex.Store({
  plugins: [createPersistedState({
    storage: window.sessionStorage,
  })],
  state,
  actions,
  mutations,
  getters
})

export default store