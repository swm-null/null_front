import axios from 'axios';
import Cookies from 'js-cookie';
import { Memo, MemoSearchAnswer } from 'pages/home/contents/_interfaces';
import { errorResponse, validResponse } from '../interface';
import { errorHandler, API_BASE_URL } from '../utils';

interface searchMemoResponse extends MemoSearchAnswer, validResponse {}

export const searchMemo = async (
  inputContent: string
): Promise<searchMemoResponse | errorResponse> => {
  const method = searchMemo.name;
  const endpoint = `${API_BASE_URL}/memos/search`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('access_token')}`,
    },
  };
  try {
    const response = await axios.post(
      endpoint,
      JSON.stringify({ content: inputContent }),
      config
    );
    const responseInfo = {
      method,
      status: response.status,
      text: response.data.processed_message,
      memos: response.data.memos,
    } as searchMemoResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

interface cuMemoResponse extends Memo, validResponse {}

export const createMemo = async (
  inputContent: string,
  inputImageUrls?: string[]
): Promise<cuMemoResponse | errorResponse> => {
  const method = createMemo.name;
  const endpoint = `${API_BASE_URL}/memo`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('access_token')}`,
    },
  };
  try {
    const response = await axios.post(
      endpoint,
      JSON.stringify({
        content: inputContent,
        image_urls: inputImageUrls ? inputImageUrls : [],
      }),
      config
    );
    const { id, content, tags, image_urls, created_at, updated_at } =
      response.data.memo;
    const responseInfo = {
      method,
      status: response.status,
      id,
      content,
      tags,
      image_urls,
      created_at,
      updated_at,
    } as cuMemoResponse;
    console.log(responseInfo);
    return responseInfo;
  } catch (error) {
    console.log(error);
    return errorHandler(error, method);
  }
};

export const updateMemo = async (
  id: string,
  content: string
): Promise<cuMemoResponse | errorResponse> => {
  const method = updateMemo.name;
  const endpoint = `${API_BASE_URL}/memos/${id}`;
  const data = JSON.stringify({
    content: content,
  });
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('access_token')}`,
    },
  };
  try {
    const response = await axios.put(endpoint, data, config);
    const { id, content, tags, image_urls, created_at, updated_at } =
      response.data.memo;
    const responseInfo = {
      method,
      status: response.status,
      id,
      content,
      tags,
      image_urls,
      created_at,
      updated_at,
    } as cuMemoResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const deleteMemo = async (
  id: string
): Promise<validResponse | errorResponse> => {
  const method = deleteMemo.name;
  const endpoint = `${API_BASE_URL}/memos/${id}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('access_token')}`,
    },
  };
  try {
    const response = await axios.delete(endpoint, config);
    const { id, content, tags, image_urls, created_at, updated_at } =
      response.data.memo;
    const responseInfo = {
      method,
      status: response.status,
      id,
      content,
      tags,
      image_urls,
      created_at,
      updated_at,
    } as cuMemoResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

interface getMemosResponse extends validResponse {
  memos: Memo[];
}

export const getAllMemos = async (): Promise<
  getMemosResponse | errorResponse
> => {
  const method = getAllMemos.name;
  const endpoint = `${API_BASE_URL}/memos`;

  try {
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${Cookies.get('access_token')}` },
    });
    const responseInfo = {
      method,
      status: response.status,
      memos: response.data,
    } as getMemosResponse;
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const getMemosByTag = async (
  tagId: string
): Promise<getMemosResponse | errorResponse> => {
  const method = getMemosByTag.name;
  const endpoint = `${API_BASE_URL}/memos/tags/${tagId}`;

  try {
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${Cookies.get('access_token')}` },
    });
    const responseInfo = {
      method,
      status: response.status,
      message: '특정 태그의 메모 가져오는 것을 성공했습니다.',
      memos: response.data,
    };
    return responseInfo;
  } catch (error) {
    return errorHandler(error, method);
  }
};

export const isValidResponse = (
  response: validResponse | errorResponse
): response is validResponse => {
  const validStatus = [200, 201, 202, 203, 204, 205, 206];
  return validStatus.includes(response.status);
};

export const isSearchMemoResponse = (
  response: searchMemoResponse | errorResponse
): response is searchMemoResponse => {
  return (response as searchMemoResponse).text !== undefined;
};

export const isCreateMemoResponse = (
  response: cuMemoResponse | errorResponse
): response is cuMemoResponse => {
  return (response as cuMemoResponse).content !== undefined;
};

export const isUpdateMemoResponse = (
  response: cuMemoResponse | errorResponse
): response is cuMemoResponse => {
  return (response as cuMemoResponse).content !== undefined;
};

export const isDeleteMemoResponse = (
  response: validResponse | errorResponse
): response is validResponse => {
  return isValidResponse(response);
};

export const isGetMemosResponse = (
  response: getMemosResponse | errorResponse
): response is getMemosResponse => {
  return isValidResponse(response as getMemosResponse);
};
