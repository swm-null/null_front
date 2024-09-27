import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from 'api/utils';

const refreshableApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${Cookies.get('access_token')}`,
  },
});

export default refreshableApi;
