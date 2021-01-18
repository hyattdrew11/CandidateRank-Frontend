
import axios from '@/api/axios'

const zoomAuth = async params => {
  return await axios.post('/auth/zoom_authentication/', params);
};

export {
  zoomAuth
}