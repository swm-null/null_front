import axios from 'axios';
import { API_BASE_URL } from 'api/utils';

export const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
