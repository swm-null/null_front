import Cookies from 'js-cookie';
import { useContext, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertContext, ApiContext } from 'utils/context';
import { isTokenResponse, refresh } from 'api/authApi/token';
import { authApi, refreshableApi } from 'api';
import { useNavigate } from 'react-router-dom';
import { AlertDialog } from 'utils/dialog';

const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { alert } = useContext(AlertContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  let refreshSubscribers: Array<(token: string) => void> = [];

  const onAccessTokenFetched = (accessToken: string) => {
    refreshSubscribers.forEach((callback) => callback(accessToken));
    refreshSubscribers = [];
  };

  const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
  };

  refreshableApi.interceptors.request.use((config) => {
    const accessToken = Cookies.get('access_token');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  });

  refreshableApi.interceptors.response.use(undefined, async (error) => {
    const errorStatus = error.response.status;
    const originalRequest = error.config;
    const refresh_token = Cookies.get('refresh_token');

    const isAccessTokenExpired = (status: number) => status === 401;
    const isRefreshTokenExpired = (status: number) => status === 403;

    if (isAccessTokenExpired(errorStatus) && refresh_token) {
      return handleAccessTokenExpiration(originalRequest, refresh_token);
    } else if (isRefreshTokenExpired(errorStatus)) {
      alert(t('utils.auth.sessionExpired')).then(() => navigate('login'));
    } else {
      return Promise.reject(error);
    }
  });

  const handleAccessTokenExpiration = async (
    originalRequest: any,
    refresh_token: string
  ) => {
    if (isRefreshing) {
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          resolve(refreshableApi(originalRequest));
        });
      });
    }

    setIsRefreshing(true);
    try {
      const response = await refresh(refresh_token);
      if (isTokenResponse(response)) {
        const newAccessToken = response.access_token;
        refreshableApi.defaults.headers.common['Authorization'] =
          `Bearer ${newAccessToken}`;
        onAccessTokenFetched(newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return refreshableApi(originalRequest);
      } else {
        throw new Error('Invalid token response');
      }
    } catch (error) {
      alert(t('utils.auth.sessionExpired')).then(() => navigate('login'));
      return Promise.reject(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <ApiContext.Provider value={{ authApi, refreshableApi }}>
      {children}
      <AlertDialog />
    </ApiContext.Provider>
  );
};

export default ApiProvider;
