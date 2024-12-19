import { errorResponse } from 'pages/api/interface';
import saveToken from 'pages/api/saveToken';
import { errorHandler, getMethodName } from 'pages/api/utils';
import axios from 'axios';

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
    const response = await axios.post(endpoint, JSON.stringify({ email, password }));
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

export const isLoginResponse = (
  response: loginResponse | errorResponse
): response is loginResponse => {
  return (response as loginResponse).access_token !== undefined;
};
