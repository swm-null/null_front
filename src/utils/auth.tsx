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

interface createMemoResponse extends Memo, validResponse {}

// 2.
export const createMemo = async (
  inputContent: string
): Promise<createMemoResponse | errorResponse> => {
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
    console.log(response);
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

// 3. FIXME: response 새로 만들어서 수정하기
export const editMemo = async (
  inputId: string,
  inputContent: string
): Promise<searchMemoResponse | errorResponse> => {
  const method = 'editMemo';
  const endpoint = `${LOCALHOST}/memos`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await axios.put(
      endpoint,
      JSON.stringify({ id: inputId, content: inputContent }),
      config
    );
    const { id, content, tags } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: '메모 수정을 성공했습니다. ',
      id,
      content,
      tags,
    };
    return responseInfo;
  } catch (error) {
    return handleError(error, method);
  }
};

interface getMemosResponse extends validResponse {
  memos: Memo[];
}

// 4.
export const getAllMemos = async (): Promise<
  getMemosResponse | errorResponse
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

// 5.
export const getSelectedTagMemos = async (
  tagId: string
): Promise<getMemosResponse | errorResponse> => {
  const method = 'getSelectedTagMemos';
  const endpoint = `${LOCALHOST}/memos/tags/${tagId}`;

  try {
    const response = await axios.get(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      message: '특정 태그의 메모 가져오는 것을 성공했습니다.',
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
  response: createMemoResponse | errorResponse
): response is createMemoResponse => {
  // FIXME: 현재 memos에 빈 array가 오는 오류가 있어서 length !== 0 확인 코드 추가
  return (response as createMemoResponse).content !== null;
};

export const isGetMemosResponse = (
  response: getMemosResponse | errorResponse
): response is getMemosResponse => {
  return isValidResponse(response as getMemosResponse);
};
