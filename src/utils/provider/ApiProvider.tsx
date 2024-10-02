import { useEffect, useContext, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { AlertDialog, AlertContext, ApiContext } from 'utils';
import { isTokenResponse, refresh, authApi, refreshableApi } from 'api';

const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
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

  const isTokenValid = (token: string) => {
    if (!token) return false;

    interface TokenPayload {
      exp: number;
      iat: number;
    }

    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  };

  const checkTokenWithAlert = async (token?: string) => {
    if (!token) {
      handleSessionExpired('utils.auth.loginRequired');
    } else if (!isTokenValid(token)) {
      handleSessionExpired('utils.auth.sessionExpired');
    }
  };

  const handleSessionExpired = (messageKey: string) => {
    alert(t(messageKey)).then(() => {
      setSessionExpired(true);
    });
  };

  const checkTokenFromCookieWithAlert = async () => {
    const token = Cookies.get('access_token');
    await checkTokenWithAlert(token);
  };

  useEffect(() => {
    if (sessionExpired) {
      navigate('/login');
    }
  }, [sessionExpired]);

  refreshableApi.interceptors.request.use((config) => {
    const accessToken = Cookies.get('access_token');
    checkTokenWithAlert(accessToken);

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  });

  refreshableApi.interceptors.response.use(
    (res) => {
      setSessionExpired(false);
      return res;
    },
    async (error) => {
      const errorStatus = error.response.status;
      const originalRequest = error.config;
      const refresh_token = Cookies.get('refresh_token');

      const isAccessTokenExpired = (status: number) => status === 401;
      const isRefreshTokenExpired = (status: number) => status === 403;

      if (isAccessTokenExpired(errorStatus) && refresh_token) {
        return handleAccessTokenExpiration(originalRequest, refresh_token);
      } else if (isRefreshTokenExpired(errorStatus)) {
        handleSessionExpired('utils.auth.sessionExpired');
      } else {
        return Promise.reject(error);
      }
    }
  );

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
      handleSessionExpired('utils.auth.sessionExpired');
      return Promise.reject(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <ApiContext.Provider
      value={{ authApi, refreshableApi, checkTokenFromCookieWithAlert }}
    >
      {children}
      <AlertDialog />
    </ApiContext.Provider>
  );
};

export default ApiProvider;
