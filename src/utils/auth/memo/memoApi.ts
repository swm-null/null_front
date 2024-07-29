import axios from 'axios';
import { errorResponse, validResponse, handleError } from 'utils/auth';
import { cuMemoResponse, searchMemoResponse } from './interface';
const LOCALHOST = import.meta.env.VITE_LOCALHOST;

export const createMemo = async (
  inputContent: string
): Promise<cuMemoResponse | errorResponse> => {
  const method = createMemo.name;
  const endpoint = `${LOCALHOST}/memos`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await axios.post(
      endpoint,
      JSON.stringify({ content: inputContent }),
      config
    );
    const { id, content, tags } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      id,
      content,
      tags,
    } as cuMemoResponse;
    return responseInfo;
  } catch (error) {
    return handleError(error, method);
  }
};

export const searchMemo = async (
  inputContent: string
): Promise<searchMemoResponse | errorResponse> => {
  const method = searchMemo.name;
  const endpoint = `${LOCALHOST}/memos/search`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
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
    return handleError(error, method);
  }
};

// 3. TODO: 작동 확인하기
export const updateMemo = async (
  id: string,
  content: string
): Promise<cuMemoResponse | errorResponse> => {
  const method = updateMemo.name;
  const endpoint = `${LOCALHOST}/memos/${id}`;
  const data = JSON.stringify({
    content: content,
  });
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await axios.put(endpoint, data, config);
    const { id, content, tags } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      id,
      content,
      tags,
    } as cuMemoResponse;
    return responseInfo;
  } catch (error) {
    return handleError(error, method);
  }
};

// 4. TODO: 작동 확인하기
export const deleteMemo = async (
  id: string
): Promise<validResponse | errorResponse> => {
  const method = deleteMemo.name;
  const endpoint = `${LOCALHOST}/memos/${id}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await axios.delete(endpoint, config);
    const { id, content, tags } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      id,
      content,
      tags,
    } as cuMemoResponse;
    return responseInfo;
  } catch (error) {
    return handleError(error, method);
  }
};
