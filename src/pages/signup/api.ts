import { errorResponse, validResponse } from 'pages/api/interface';
import { errorHandler, getMethodName } from 'pages/api/utils';
import axios from 'axios';

export const checkEmailDuplication = async (
  email: string
): Promise<validResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = '/user/checkEmail';
  try {
    const response = await axios.post(endpoint, JSON.stringify({ email }));
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
    const response = await axios.post(
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
