import axios from 'axios';
import Cookies from 'js-cookie';
import { useContext, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertContext, ApiContext } from 'utils/context';
import { isTokenResponse, refresh } from 'api/authApi/token';
import { authApi, refreshableApi } from 'api';
import { useNavigate } from 'react-router-dom';

const ApiProvider = ({ children }: { children: ReactNode }) => {
  let isRefreshing = false;
  refreshableApi.interceptors.response.use(undefined, async (error) => {
    const isAccessTokenExpired = (status: number) => status === 401;
    const isRefreshTokenExpired = (status: number) => status === 403;

    const errorStatus = error.response.status;
    if (isAccessTokenExpired(errorStatus)) {
      const refresh_token = Cookies.get('refresh_token');
      if (refresh_token) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            console.log('refresh try');
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
      console.log('refresh token expired');
      const { alert } = useContext(AlertContext);
      const { t } = useTranslation();
      const navigate = useNavigate();
      alert(t('utils.auth.sessionExpired')).then(() => {
        navigate('login');
      });
    }
    return Promise.reject(error);
  });

  return (
    <ApiContext.Provider value={{ authApi, refreshableApi }}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;
