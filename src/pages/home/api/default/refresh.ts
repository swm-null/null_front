import { errorResponse } from 'pages/api/interface';
import saveToken from 'pages/api/saveToken';
import { errorHandler, getMethodName } from 'pages/api/utils';
import axios from 'axios';

interface tokenResponse {
  access_token: string;
  refresh_token: string;
}

export const refresh = async (
  refresh_token: string
): Promise<tokenResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = '/user/refresh';
  try {
    const response = await axios.post(endpoint, JSON.stringify({ refresh_token }));
    const responseInfo = {
      method,
      status: response.status,
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    } as tokenResponse;
    saveToken(responseInfo.access_token, responseInfo.refresh_token);
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const isTokenResponse = (
  response: tokenResponse | errorResponse
): response is tokenResponse => {
  return (response as tokenResponse).access_token !== undefined;
};
