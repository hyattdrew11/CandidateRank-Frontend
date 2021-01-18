
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import {
  authenticate,
  authenticateAS,
  register,
  getCandidates
} from '@/api'
import { isValidJwt, EventBus } from '@/utils'

Vue.use(Vuex)

const state = {
  user: null,
  candidates: [],
  userData: {},
  jwt: ''
}

const actions = {
  loginAS(context, userData) {
    console.log(context, userData)
    context.commit('setUserData', { userData })
    return authenticateAS(userData)
      .then((response) => {
        console.log(response)
        context.commit('setJwtToken', { jwt: response.data })
        EventBus.$emit('authenticated', 'Sucessful login')
        window.open('/dashboard', '_blank');
        // window.location.href =  '/dashboard'
        // if(response.data.error == 'auth-zoom') {
        //   context.commit('setJwtToken', { jwt: response.data.token })

        //   window.location.href =  'https://zoom.us/oauth/authorize?response_type=code&client_id=k6uY18lSSjqNNenR0lspOg&redirect_uri=' + redirUrl
        // }
        // else {
        //   context.commit('setJwtToken', { jwt: response.data })
        //   EventBus.$emit('authenticated', 'Sucessful login')
        //   window.location.href =  '/dashboard'
        // }
      })
      .catch(error => {
        EventBus.$emit('failedAuthentication', 'Error logging in please check your email and password then try again.')
      })
  },
  login(context, userData) {
    console.log(context, userData)
    context.commit('setUserData', { userData })
    return authenticate(userData)
      .then((response) => {
        console.log(response)
        context.commit('setJwtToken', { jwt: response.data })
        EventBus.$emit('authenticated', 'Successful login')
        window.location.href = '/dashboard'
        // if(response.data.error == 'auth-zoom') {
        //   context.commit('setJwtToken', { jwt: response.data.token })

        //   window.location.href =  'https://zoom.us/oauth/authorize?response_type=code&client_id=k6uY18lSSjqNNenR0lspOg&redirect_uri=' + redirUrl
        // }
        // else {
        //   context.commit('setJwtToken', { jwt: response.data })
        //   EventBus.$emit('authenticated', 'Sucessful login')
        //   window.location.href =  '/dashboard'
        // }
      })
      .catch(error => {
        EventBus.$emit('failedAuthentication', 'Error logging in please check your email and password then try again.')
      })
  },
  register(context, userData) {
    context.commit('setUserData', { userData })
    return register(userData)
      .then((response) => {
        alert('Registration Successful')
        window.location.href = '/login'
      })
      .catch(error => {
        alert('Error registering, please try again.')
        EventBus.$emit('failedRegistering: ', error)
      })
  },
  loadCandidates(organization) {
    return getCandidates(organization)
      .then((response) => {
        context.commit('setCandidates', { candidates: response })
      })
  }
}

const mutations = {
  setCandidates(state, payload) {
    state.candidates = payload.candidates
  },
  setUserData(state, payload) {
    console.log(state, payload)
    state.user = payload.userData
    localStorage.user = JSON.stringify(payload.userData)
    console.log(localStorage.user)
  },
  setJwtToken(state, payload) {
    console.log(state, payload)
    localStorage.token = payload.jwt.token
    localStorage.user = JSON.stringify(state.user)
    state.jwt = payload.jwt
    state.user = payload.jwt.token.user
  }
}

const getters = {
  isAuthenticated(state) {
    if (state.jwt) {
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