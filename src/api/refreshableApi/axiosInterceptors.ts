import axios from 'axios';
import Cookies from 'js-cookie';
import { isTokenResponse, refresh } from '../authApi/token';
import refreshableApi from './_api';

let isRefreshing = false;
refreshableApi.interceptors.response.use(async (res) => {
  const isAccessTokenExpired = (status: number) => status === 401;
  if (isAccessTokenExpired(res.status)) {
    const refresh_token = Cookies.get('refresh_token');
    if (refresh_token) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await refresh(refresh_token);
          if (isTokenResponse(response)) {
            const newAccessToken = response.access_token;
            axios.defaults.headers.common['Authorization'] =
              `Bearer ${newAccessToken}`;
            return axios(res.config);
          }
        } catch (error) {
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }
    }
  }
  return res;
});
