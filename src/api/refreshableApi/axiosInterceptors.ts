import axios from 'axios';
import Cookies from 'js-cookie';
import { isTokenResponse, refresh } from '../authApi/token';

let isRefreshing = false;
axios.interceptors.response.use(async (res) => {
  // 액세스 토큰 만료
  if (res.status === 401) {
    // 리프레시 시도
    const refresh_token = Cookies.get('refresh_token');
    if (refresh_token) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await refresh(refresh_token); // 토큰 갱신 요청
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
