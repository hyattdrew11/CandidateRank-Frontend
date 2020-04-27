import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

export function authenticate (userData) {
  return axios.post(`${API_URL}/auth/login/`, userData)
}

export function register (userData) {
  return axios.post(`${API_URL}/auth/register/`, userData)
}

export function getCandidates (organization) {
  return axios.get(`${API_URL}/candidates/all/`+organization)
}
