import { errorResponse } from 'api/interface';
import { API_BASE_URL, errorHandler } from 'api/utils';
import axios from 'axios';
import saveToken from './saveToken';

interface tokenResponse {
  access_token: string;
  refresh_token: string;
}

export const refresh = async (
  refresh_token: string
): Promise<tokenResponse | errorResponse> => {
  const method = refresh.name;
  const endpoint = `${API_BASE_URL}/user/refresh`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await axios.post(
      endpoint,
      JSON.stringify({ refresh_token }),
      config
    );
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
