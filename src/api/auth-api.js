
import axios from '@/api/axios'

const resetPassword = async params => {
  return await axios.post('/auth/password_reset/', params);
};

export {
  resetPassword
}