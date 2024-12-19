import axios from 'axios';
import { API_BASE_URL } from 'pages/api/utils';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { isTokenResponse, refresh } from './refresh';

export const refreshableApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isTokenExpired = (status: number) => status === 401;
const isAccessTokenExpired = (status: number, code: string) =>
  isTokenExpired(status) && code === '0003';
const isRefreshTokenExpired = (status: number, code: string) =>
  isTokenExpired(status) && code === '0004';

export const isTokenValid = (token: string) => {
  if (!token) return false;

  interface TokenPayload {
    exp: number;
    iat: number;
  }

  const decoded = jwtDecode<TokenPayload>(token);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const onAccessTokenFetched = (accessToken: string) => {
  refreshSubscribers.forEach((callback) => callback(accessToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

refreshableApi.interceptors.request.use(async (config) => {
  const accessToken = Cookies.get('access_token');
  if (accessToken && isTokenValid(accessToken)) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
    return config;
  }

  const refreshToken = Cookies.get('refresh_token');
  if (!refreshToken) {
    return Promise.reject('No refresh token available');
  }

  try {
    const newAccessToken = await getNewAccessToken(refreshToken);
    if (newAccessToken) {
      config.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return config;
    }
    return Promise.reject('Failed to refresh token');
  } catch (error) {
    return Promise.reject(error);
  }
});

refreshableApi.interceptors.response.use(undefined, async (error) => {
  const errorStatus = error.response?.status;
  const errorCode = error.response?.data?.code;
  const originalRequest = error.config;

  if (isRefreshTokenExpired(errorStatus, errorCode)) {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    return Promise.reject('Refresh token expired');
  }

  if (isAccessTokenExpired(errorStatus, errorCode)) {
    const refreshToken = Cookies.get('refresh_token');
    if (refreshToken) {
      const newAccessToken = await getNewAccessToken(refreshToken);
      if (newAccessToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return refreshableApi(originalRequest);
      }
    }
  }
  return Promise.reject(error);
});

export async function getNewAccessToken(refreshToken: string) {
  if (isRefreshing) {
    return new Promise((resolve) => {
      addRefreshSubscriber((token) => resolve(token));
    });
  }

  isRefreshing = true;
  try {
    const response = await refresh(refreshToken);
    if (isTokenResponse(response)) {
      const newAccessToken = response.access_token;
      onAccessTokenFetched(newAccessToken);
      Cookies.set('access_token', newAccessToken);
      return newAccessToken;
    }
    throw new Error('Invalid token response');
  } catch (error) {
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
}
