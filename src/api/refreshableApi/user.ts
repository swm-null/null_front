import { errorResponse, validResponse } from 'api/interface';
import { errorHandler, getMethodName } from 'api/utils';
import { refreshableApi } from './_api';

export const deleteUserAccount = async (): Promise<
  validResponse | errorResponse
> => {
  const method = getMethodName();
  const endpoint = '/user';
  try {
    const response = await refreshableApi.delete(endpoint);
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
