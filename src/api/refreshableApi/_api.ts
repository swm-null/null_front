import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from 'api/utils';
import { isTokenResponse, refresh } from '../authApi/token';
import { useContext } from 'react';
import { AlertContext } from 'utils/context';
import { useTranslation } from 'react-i18next';

let isRefreshing = false;
export const refreshableApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${Cookies.get('access_token')}`,
    'Content-Type': 'application/json',
  },
});

refreshableApi.interceptors.response.use(undefined, async (error) => {
  const isAccessTokenExpired = (status: number) => status === 401;
  const isRefreshTokenExpired = (status: number) => status === 403;

  const errorStatus = error.response.status;
  const { alert } = useContext(AlertContext);
  const { t } = useTranslation();

  const onAlertClick = async (message: string, page: string) => {
    await alert(message);
    window.location.href = `/${page}`;
  };

  if (isAccessTokenExpired(errorStatus)) {
    const refresh_token = Cookies.get('refresh_token');
    if (refresh_token) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await refresh(refresh_token);
          if (isTokenResponse(response)) {
            const newAccessToken = response.access_token;
            refreshableApi.defaults.headers.common['Authorization'] =
              `Bearer ${newAccessToken}`;
            return axios(error.config);
          }
        } catch (error) {
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }
    }
  } else if (isRefreshTokenExpired(errorStatus)) {
    onAlertClick(t('utils.auth.sessionExpired'), 'login');
  }
  return error;
});
