import { errorResponse, validResponse } from 'api/interface';
import { errorHandler, getMethodName } from 'api/utils';
import { refreshableApi } from './_api';

interface CheckTempMemoBatchingResponse extends validResponse {
  id: string;
}

export const checkTempMemoBatching = async function (
  memoId: string
): Promise<CheckTempMemoBatchingResponse | errorResponse> {
  const method = getMethodName();
  // FIXME: endpoint 수정하기
  const endpoint = `/memos/search/history?memoId=${memoId}`;

  try {
    const response = await refreshableApi.get(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      id: response.data.id,
      query: response.data.query,
    } as CheckTempMemoBatchingResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};
