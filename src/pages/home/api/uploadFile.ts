import { errorHandler, getMethodName } from 'pages/api/utils';
import { refreshableApi } from './default';
import { errorResponse, validResponse } from 'pages/api/interface';

interface uploadFilesResponse extends validResponse {
  urls: string[];
}

export const uploadFile = async function (
  file: File
): Promise<uploadFilesResponse | errorResponse> {
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
      urls: [response.data.file_url],
    } as uploadFilesResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const uploadFiles = async function (
  files: File[]
): Promise<uploadFilesResponse | errorResponse> {
  const method = getMethodName();
  const endpoint = '/upload/files';
  const headers = {
    'Content-Type': 'multipart/form-data',
  };

  const formData = new FormData();
  files.map((file) => {
    formData.append('files', file);
  });

  try {
    const response = await refreshableApi.post(endpoint, formData, { headers });
    const responseInfo = {
      method,
      status: response.status,
      urls: response.data.file_urls,
    } as uploadFilesResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const isFilesResponse = (
  response: uploadFilesResponse | errorResponse
): response is uploadFilesResponse => {
  return (response as uploadFilesResponse).urls !== undefined;
};
