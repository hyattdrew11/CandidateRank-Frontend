
import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

const resetPassword = async params => {
  return await axios.post(`${API_URL}/auth/password_reset/`, params);
};

export {
  resetPassword
}