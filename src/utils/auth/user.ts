import axios from 'axios';
import { errorHandler, LOCALHOST } from './errorHandler';
import { errorResponse, validResponse } from './types';

interface loginResponse {
  access_token: string;
  refresh_token: string;
}

export const login = async (
  email: string,
  password: string
): Promise<loginResponse | errorResponse> => {
  const method = 'login';
  const endpoint = `${LOCALHOST}/user/login`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await axios.post(
      endpoint,
      JSON.stringify({ email, password }),
      config
    );
    const responseInfo = {
      method,
      status: response.status,
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    } as loginResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const signup = async (
  email: string,
  password: string,
  confirmPassword: string
): Promise<validResponse | errorResponse> => {
  const method = 'signup';
  const endpoint = `${LOCALHOST}/user/register`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await axios.post(
      endpoint,
      JSON.stringify({ email, password, confirm_password: confirmPassword }),
      config
    );
    const responseInfo = {
      method,
      status: response.status,
      message: response.data,
    } as validResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const isLoginResponse = (
  response: loginResponse | errorResponse
): response is loginResponse => {
  return (response as loginResponse).access_token !== undefined;
};
