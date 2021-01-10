
import axios from '@/api/axios'

export function authenticate(userData) {
  return axios.post('/auth/login/', userData)
}

export function authenticateAS(userData) {
  return axios.post('/auth/login/as', userData)
}

export function register(userData) {
  return axios.post('/auth/register/', userData)
}

export function getCandidates(organization) {
  return axios.get(`/candidates/all/${organization}`)
}

export function resetPassword(params) {
  return axios.post('/auth/password_reset/', params)
}

export function updatePassword(params) {
  return axios.post('/auth/password_update/', params)
}