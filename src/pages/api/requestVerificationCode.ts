import { errorResponse, validResponse } from 'pages/api/interface';
import { API_BASE_URL, errorHandler, getMethodName } from 'pages/api/utils';
import axios from 'axios';

export const requestVerificationCode = async (
  email: string
): Promise<validResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = '/user/email/verificationCode';
  try {
    const response = await axios.post(
      API_BASE_URL + endpoint,
      JSON.stringify({ email }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
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
