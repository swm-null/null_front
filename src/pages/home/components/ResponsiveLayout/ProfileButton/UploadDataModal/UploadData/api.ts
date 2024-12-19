import { errorResponse, validResponse } from 'pages/api/interface';
import { errorHandler, getMethodName } from 'pages/api/utils';
import { refreshableApi } from 'pages/home/api';

export const createMemos = async (
  fileUrl: string,
  email: string
): Promise<validResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = `/memos`;
  try {
    const response = await refreshableApi.post(
      endpoint,
      JSON.stringify({
        file_url: fileUrl,
        email,
      })
    );
    const responseInfo = {
      method,
      status: response.status,
    } as validResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};
