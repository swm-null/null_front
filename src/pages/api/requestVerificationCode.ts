import { errorResponse, validResponse } from 'pages/api/interface';
import { errorHandler, getMethodName } from 'pages/api/utils';
import axios from 'axios';

export const requestVerificationCode = async (
  email: string
): Promise<validResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = '/user/sendCode';
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
