import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from 'api/utils';

export const refreshableApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${Cookies.get('access_token')}`,
    'Content-Type': 'application/json',
  },
});
