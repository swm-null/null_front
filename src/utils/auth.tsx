import axios from 'axios';
import { Memo, MemoSearchAnswer } from 'pages/home/contents/@interfaces';
const LOCALHOST = import.meta.env.VITE_LOCALHOST;

export interface validResponse {
  method: string;
  status: number;
  message: string;
}

export interface errorResponse {
  method: string;
  status: number;
  exceptionCode?: number;
  message: string;
}

export const handleError = (error: unknown, method: string): errorResponse => {
  let errorInfo;

  if (axios.isAxiosError(error)) {
    // 요청이 전송되었고, 서버는 2xx 외의 상태 코드로 응답했습니다.
    if (error.response) {
      const httpErrorCode = error.response.status;
      const errorDetails = error.response?.data
        ? { ...error.response.data }
        : {};

      errorInfo = {
        method,
        status: httpErrorCode,
        message: error.message,
        exceptionCode: errorDetails.exceptionCode,
      };
    }

    // 요청이 전송되었지만, 응답이 수신되지 않았습니다.
    else if (error.request) {
      errorInfo = {
        method,
        status: 0,
        message: '서버로부터 응답이 없습니다.',
      };
    }

    // 요청을 설정하는 동안 문제가 발생했습니다.
    else {
      errorInfo = {
        method,
        status: -1,
        message: '요청을 설정하는 동안 문제가 발생했습니다.',
      };
    }
  } else if (error instanceof Error) {
    errorInfo = {
      method,
      status: -2,
      message: `${method}에서 예상치 못한 에러 발생: ${error.message}`,
    };
  } else {
    errorInfo = {
      method,
      status: -3,
      message: `${method}에서 처리할 수 없는 예상치 못한 에러 발생`,
    };
  }

  return errorInfo;
};

interface searchMemoResponse extends MemoSearchAnswer, validResponse {}

// 1. OK
export const searchMemo = async (
  inputContent: string
): Promise<searchMemoResponse | errorResponse> => {
  const method = 'searchMemo';
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
      message: '메모 검색을 성공했습니다. ',
      text: response.data.processed_message,
      memos: response.data.memos,
    };
    return responseInfo;
  } catch (error) {
    return handleError(error, method);
  }
};

// Create, Update Memo Response
interface cuMemoResponse extends Memo, validResponse {}

// 2. TODO: 작동 확인하기
export const createMemo = async (
  inputContent: string
): Promise<cuMemoResponse | errorResponse> => {
  const method = 'createMemo';
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
      message: '메모를 생성했습니다. ',
      id,
      content,
      tags,
    };
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
  const method = 'editMemo';
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
      message: '메모 수정을 성공했습니다.',
      id,
      content,
      tags,
    };
    return responseInfo;
  } catch (error) {
    return handleError(error, method);
  }
};

// 4. TODO: 작동 확인하기
export const deleteMemo = async (
  id: string
): Promise<validResponse | errorResponse> => {
  const method = 'deleteMemo';
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
      message: '메모를 삭제했습니다.',
      id,
      content,
      tags,
    };
    return responseInfo;
  } catch (error) {
    return handleError(error, method);
  }
};

interface getAllMemosResponse extends validResponse {
  memos: Memo[];
}

// 5.
export const getAllMemos = async (): Promise<
  getAllMemosResponse | errorResponse
> => {
  const method = 'getAllMemos';
  const endpoint = `${LOCALHOST}/memos`;

  try {
    const response = await axios.get(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      message: '모든 메모 가져오는 것을 성공했습니다.',
      memos: response.data,
    };
    return responseInfo;
  } catch (error) {
    return handleError(error, method);
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
  return (response as searchMemoResponse).text !== null;
};

export const isCreateMemoResponse = (
  response: cuMemoResponse | errorResponse
): response is cuMemoResponse => {
  return (response as cuMemoResponse).content !== null;
};

export const isUpdateMemoResponse = (
  response: cuMemoResponse | errorResponse
): response is cuMemoResponse => {
  return (response as cuMemoResponse).content !== null;
};

export const isDeleteMemoResponse = (
  response: validResponse | errorResponse
): response is validResponse => {
  return isValidResponse(response);
};

export const isGetAllMemosResponse = (
  response: getAllMemosResponse | errorResponse
): response is getAllMemosResponse => {
  return isValidResponse(response);
};
