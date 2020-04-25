// utils/index.js

import Vue from 'vue'

export const EventBus = new Vue()

export function isValidJwt (jwt) {
  if (!jwt.token || jwt.token.split('.').length < 3) {
    return false
  }
  const data = JSON.parse(atob(jwt.token.split('.')[1]))
  // console.log(data)
  // const exp = new Date(data.exp * 1000) 
  // JS deals with dates in milliseconds since epoch
  // const now = new Date()
  return true
}