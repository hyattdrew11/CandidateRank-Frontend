
import Vue from 'vue'

export const EventBus = new Vue()

export const isValidJwt = (jwt) => {
  if (!jwt.token || jwt.token.split('.').length < 3) {
    return false
  }

  // ? should check this comment code. we can check token expired. by great.dolphin.ls
  // const data = JSON.parse(atob(jwt.token.split('.')[1]))
  // const exp = new Date(data.exp * 1000) 
  return true
}