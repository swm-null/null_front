import axios from 'axios';
import * as Config from '../config';
const LOCALHOST = Config.LOCALHOST;

export interface validResponse {
  method: string;
  status: number,
  message: string;
}

export interface errorResponse {
  method: string,
  status: number,
  exceptionCode?: number,
  message: string,
}

export const handleError = (error: unknown, method: string): errorResponse => {
  let errorInfo;

  if (axios.isAxiosError(error)) {

    // 요청이 전송되었고, 서버는 2xx 외의 상태 코드로 응답했습니다.
    if (error.response) {
      console.log(error)
      const httpErrorCode = error.response.status;
      const errorDetails = error.response?.data ? { ...error.response.data } : {};  
      
      errorInfo = {
        method,
        status: httpErrorCode,
        message: errorDetails.message,
        exceptionCode: errorDetails.exceptionCode,
      };
    }

    // 요청이 전송되었지만, 응답이 수신되지 않았습니다.
    else if (error.request) { 
      errorInfo = {
        method,
        status: 0,
        message: "서버로부터 응답이 없습니다.",
      };
    }

    // 요청을 설정하는 동안 문제가 발생했습니다.
    else {
      errorInfo = {
        method,
        status: -1,
        message: "요청을 설정하는 동안 문제가 발생했습니다.",
      }
    }
    
  } 
  
  else if (error instanceof Error) {
    errorInfo = {
      method,
      status: -2,
      message: `${method}에서 예상치 못한 에러 발생: ${error.message}`,
    }
  } 
  
  else {
    errorInfo = {
      method,
      status: -3,
      message: `${method}에서 처리할 수 없는 예상치 못한 에러 발생`,
    }
  }
  
  console.log("handleError:", JSON.stringify(errorInfo));
  return errorInfo;
}

interface memo {
  id: string;
  content: string;
  tags: string[];
}

interface searchMemoResponse extends validResponse {
  memos: memo[]
}

interface memoResponse extends memo, validResponse {
}

// 1. OK
export const searchMemo = async (inputContent: string): Promise<memoResponse | errorResponse> => {
  const method = "searchMemo";
  const endpoint = `${LOCALHOST}/memos/search`;
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    const response = await axios.post(endpoint, JSON.stringify({"content": inputContent}), config);
    const { id, content, tags } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "메모 검색을 성공했습니다. ",
      id,
      content,
      tags
    }
    console.log(response)
    return responseInfo;
  }
  catch (error) {
    console.log(error)
    return handleError(error, method);
  }
}

// 2. OK
export const addMemo = async (inputContent: string): Promise<memoResponse | errorResponse> => {
  const method = "addMemo";
  const endpoint = `${LOCALHOST}/memos`;
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    const response = await axios.post(endpoint, JSON.stringify({"content": inputContent}), config);
    const { id, content, tags } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "메모 추가를 성공했습니다. ",
      id,
      content,
      tags
    }
    console.log(response)
    return responseInfo;
  }
  catch (error) {
    console.log(error)
    return handleError(error, method);
  }
}

// 3. Check
export const editMemo = async (inputId: string, inputContent: string): Promise<memoResponse | errorResponse> => {
  const method = "editMemo";
  const endpoint = `${LOCALHOST}/memos`;
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    const response = await axios.put(endpoint, JSON.stringify({"id": inputId, "content": inputContent}), config);
    const { id, content, tags } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "메모 수정을 성공했습니다. ",
      id,
      content,
      tags
    }
    console.log(response)
    return responseInfo;
  }
  catch (error) {
    console.log(error)
    return handleError(error, method);
  }
}

export const isValidResponse = (response: validResponse | errorResponse): response is validResponse => {
  const validStatus = [200, 201, 202, 203, 204, 205, 206];
  return validStatus.includes(response.status)
}

export const isErrorResponse = (response: validResponse | errorResponse): response is errorResponse => {
  return (response as errorResponse).exceptionCode !== undefined;
}

export const isMemoResponse = (response: memoResponse | errorResponse): response is memoResponse => {
  return (response as memoResponse).id !== undefined;
}
