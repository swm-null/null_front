import { errorResponse, validResponse } from 'pages/api/interface';
import { errorHandler, getMethodName } from 'pages/api/utils';
import { cuMemoResponse } from '../interface';
import { refreshableApi } from 'pages/home/api';

export const deleteMemo = async (
  id: string
): Promise<validResponse | errorResponse> => {
  const method = getMethodName();
  const endpoint = `/memo/${id}`;
  try {
    const response = await refreshableApi.delete(endpoint);
    const responseInfo = {
      method,
      status: response.status,
    } as cuMemoResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};
