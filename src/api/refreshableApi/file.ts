import { errorResponse, validResponse } from '../interface';
import { errorHandler, getMethodName } from '../utils';
import { refreshableApi } from './_api';

interface uploadFileResponse extends validResponse {
  url: string;
}

export const uploadFile = async function (
  file: File
): Promise<uploadFileResponse | errorResponse> {
  const method = getMethodName();
  const endpoint = '/upload/file';
  const headers = {
    'Content-Type': 'multipart/form-data',
  };

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await refreshableApi.post(endpoint, formData, { headers });
    const responseInfo = {
      method,
      status: response.status,
      url: response.data.file_url,
    } as uploadFileResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const isFileResponse = (
  response: uploadFileResponse | errorResponse
): response is uploadFileResponse => {
  return (response as uploadFileResponse).url !== undefined;
};
