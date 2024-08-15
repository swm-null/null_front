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
  const endpoint = `${LOCALHOST}/users/login`;
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
    console.log(email, password, response);
    const responseInfo = {
      method,
      status: response.status,
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    } as loginResponse;
    return responseInfo;
  } catch (error) {
    console.log(error);
    return errorHandler(error, method);
  }
};

export const signup = async (
  email: string,
  password: string
): Promise<validResponse | errorResponse> => {
  const method = 'signup';
  const endpoint = `${LOCALHOST}/users/register`;
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
