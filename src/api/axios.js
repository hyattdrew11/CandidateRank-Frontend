
import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

const apiAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

export default apiAxios;