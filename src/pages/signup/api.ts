import { errorResponse, validResponse } from 'pages/api/interface';
import { API_BASE_URL, errorHandler, getMethodName } from 'pages/api/utils';
import axios from 'axios';

export const checkEmailDuplication = async (
  email: string
): Promise<validResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = `/user/email/exists?email=${email}`;
  try {
    const response = await axios.get(API_BASE_URL + endpoint);
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
