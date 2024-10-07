import { useEffect, useContext, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AlertDialog, AlertContext, ApiContext } from 'utils';
import { isTokenResponse, refresh, authApi, refreshableApi } from 'api';
import { jwtDecode } from 'jwt-decode';

const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [redirectLogin, setRedirectLogin] = useState(false);
  const { alert } = useContext(AlertContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  let refreshSubscribers: Array<(token: string) => void> = [];

  const isTokenExpired = (status: number) => status === 401;
  const isAccessTokenExpired = (status: number, code: string) =>
    isTokenExpired(status) && code === '0003';
  const isRefreshTokenExpired = (status: number, code: string) =>
    isTokenExpired(status) && code === '0004';

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

  const alertLoginRequiredThenRedirect = () => {
    alert(t('utils.auth.loginRequired')).then(() => {
      setRedirectLogin(true);
    });
  };

  const alertSessionExpiredThenRedirect = () => {
    alert(t('utils.auth.sessionExpired')).then(() => {
      setRedirectLogin(true);
    });
  };

  const checkTokenFromCookie = async () => {
    await getAccessToken();
  };

  const getAccessToken = async () => {
    const accessToken = Cookies.get('access_token');
    if (accessToken && isTokenValid(accessToken)) {
      return accessToken;
    } else {
      return getNewAccessToken();
    }
  };

  const getNewAccessToken = async () => {
    const refreshToken = Cookies.get('refresh_token');
    if (refreshToken) {
      return getAccessTokenByRefresh(refreshToken);
    } else {
      alertLoginRequiredThenRedirect();
    }
  };

  const getAccessTokenByRefresh = async (refreshToken: string) => {
    if (isRefreshing) {
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => resolve(newToken));
      });
    }

    setIsRefreshing(true);
    try {
      const response = await refresh(refreshToken);
      if (isTokenResponse(response)) {
        const newAccessToken = response.access_token;
        onAccessTokenFetched(newAccessToken);
        Cookies.set('access_token', newAccessToken);
        return newAccessToken;
      } else {
        throw new Error('Invalid token response');
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorResponse = (error as any).response;
        const errorStatus = errorResponse?.status;
        const errorCode = errorResponse?.data?.code;

        if (isRefreshTokenExpired(errorStatus, errorCode)) {
          alertSessionExpiredThenRedirect();
        }
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (redirectLogin) {
      setRedirectLogin(false);
      navigate('/login');
    }
  }, [redirectLogin]);

  refreshableApi.interceptors.request.use(async (config) => {
    const accessToken = await getAccessToken();
    config.headers['Authorization'] = `Bearer ${accessToken}`;
    return config;
  });

  refreshableApi.interceptors.response.use(undefined, async (error) => {
    const errorStatus = error.response.status;
    const errorCode = error.response.data.code;
    const originalRequest = error.config;

    if (isAccessTokenExpired(errorStatus, errorCode)) {
      const newAccessToken = await getNewAccessToken();
      if (newAccessToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return refreshableApi(originalRequest);
      }
    } else if (isRefreshTokenExpired(errorStatus, errorCode)) {
      alertSessionExpiredThenRedirect();
    } else {
      await alert('utils.auth.serverError');
      return Promise.reject(error);
    }
  });

  return (
    <ApiContext.Provider
      value={{ authApi, refreshableApi, checkTokenFromCookie }}
    >
      {children}
      <AlertDialog />
    </ApiContext.Provider>
  );
};

export default ApiProvider;
