import { useContext, ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AlertDialog, AlertContext, ApiContext } from 'utils';
import { isTokenResponse, refresh, authApi, refreshableApi } from 'api';
import { jwtDecode } from 'jwt-decode';

const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { alert } = useContext(AlertContext);
  const { t } = useTranslation();

  const navigate = useNavigate();

  const isRefreshingRef = useRef(false);
  const alertedRef = useRef(false);
  const refreshSubscribersRef = useRef<Array<(token: string) => void>>([]);

  const isTokenExpired = (status: number) => status === 401;
  const isAccessTokenExpired = (status: number, code: string) =>
    isTokenExpired(status) && code === '0003';
  const isRefreshTokenExpired = (status: number, code: string) =>
    isTokenExpired(status) && code === '0004';

  const onAccessTokenFetched = (accessToken: string) => {
    refreshSubscribersRef.current.forEach((callback) => callback(accessToken));
    refreshSubscribersRef.current.length = 0;
  };

  const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribersRef.current.push(callback);
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
    if (!alertedRef.current) {
      alertedRef.current = true;
      alert(t('utils.auth.loginRequired')).then(() => {
        navigate('/login');
        alertedRef.current = false;
      });
    }
  };

  const alertSessionExpiredThenRedirect = () => {
    if (!alertedRef.current) {
      alertedRef.current = true;
      alert(t('utils.auth.sessionExpired')).then(() => {
        navigate('/login');
        alertedRef.current = false;
      });
    }
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
    if (isRefreshingRef.current) {
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => resolve(newToken));
      });
    }

    isRefreshingRef.current = true;
    try {
      const response = await refresh(refreshToken);

      if (isTokenResponse(response)) {
        const newAccessToken = response.access_token;
        onAccessTokenFetched(newAccessToken);
        Cookies.set('access_token', newAccessToken);
        return newAccessToken;
      } else {
        const errorStatus = response.status;
        const errorCode = response.exceptionCode;

        if (isRefreshTokenExpired(errorStatus, errorCode)) {
          alertSessionExpiredThenRedirect();
        }
        throw new Error('Invalid token response');
      }
    } catch (error) {
      alertLoginRequiredThenRedirect();
    } finally {
      isRefreshingRef.current = false;
    }
  };

  refreshableApi.interceptors.request.use(async (config) => {
    if (alertedRef.current) return Promise.reject('Refresh Token Expired');

    const accessToken = await getAccessToken();
    if (!accessToken) return Promise.reject('Refresh Token Expired');

    config.headers['Authorization'] = `Bearer ${accessToken}`;
    return config;
  });

  refreshableApi.interceptors.response.use(undefined, async (error) => {
    if (alertedRef.current) return null;

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
      alertLoginRequiredThenRedirect();
      return Promise.reject(error);
    }
  });

  return (
    <ApiContext.Provider value={{ authApi, refreshableApi, checkTokenFromCookie }}>
      {children}
      <AlertDialog />
    </ApiContext.Provider>
  );
};

export default ApiProvider;
