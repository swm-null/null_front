import { errorResponse, validResponse } from '../interface';
import { errorHandler, getMethodName } from '../utils';
import { authApi } from './_api';
import saveToken from './saveToken';

interface loginResponse {
  access_token: string;
  refresh_token: string;
}

export const login = async (
  email: string,
  password: string
): Promise<loginResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = '/user/login';
  try {
    const response = await authApi.post(
      endpoint,
      JSON.stringify({ email, password })
    );
    const responseInfo = {
      method,
      status: response.status,
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    } as loginResponse;
    saveToken(responseInfo.access_token, responseInfo.refresh_token);
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const signup = async (
  email: string,
  password: string,
  confirmPassword: string,
  name: string,
  code: string
): Promise<validResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = '/user/register';
  try {
    const response = await authApi.post(
      endpoint,
      JSON.stringify({
        email,
        password,
        confirm_password: confirmPassword,
        name,
        code,
      })
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

export const checkEmail = async (
  email: string
): Promise<validResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = '/user/checkEmail';
  try {
    const response = await authApi.post(endpoint, JSON.stringify({ email }));
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

export const sendCode = async (
  email: string
): Promise<validResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = '/user/sendCode';
  try {
    const response = await authApi.post(endpoint, JSON.stringify({ email }));
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

export const resetPassword = async (
  email: string,
  newPassword: string,
  confirmPassword: string,
  code: string
): Promise<validResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = '/user/findPassword';
  try {
    const response = await authApi.post(
      endpoint,
      JSON.stringify({
        email,
        new_password: newPassword,
        confirm_password: confirmPassword,
        code,
      })
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

export const verifyCode = async (
  email: string,
  code: string
): Promise<validResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = '/user/verifyCode';
  try {
    const response = await authApi.post(endpoint, JSON.stringify({ email, code }));
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
