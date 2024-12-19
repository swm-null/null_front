import { errorResponse, validResponse } from 'pages/api/interface';
import { errorHandler, getMethodName } from 'pages/api/utils';
import axios from 'axios';

export const checkVerificationCode = async (
  email: string,
  code: string
): Promise<validResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = '/user/verifyCode';
  try {
    const response = await axios.post(endpoint, JSON.stringify({ email, code }));
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
    const response = await axios.post(
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
