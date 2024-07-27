import axios from 'axios';
import { errorResponse } from './interface';

const handleError = (error: unknown, method: string): errorResponse => {
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
      } as errorResponse;
    }
    // 요청이 전송되었지만, 응답이 수신되지 않았습니다.
    else if (error.request) {
      errorInfo = {
        method,
        status: 0,
        message: '서버로부터 응답이 없습니다.',
      } as errorResponse;
    }
    // 요청을 설정하는 동안 문제가 발생했습니다.
    else {
      errorInfo = {
        method,
        status: -1,
        message: '요청을 설정하는 동안 문제가 발생했습니다.',
      } as errorResponse;
    }
  } else if (error instanceof Error) {
    errorInfo = {
      method,
      status: -2,
      message: `${method}에서 예상치 못한 에러 발생: ${error.message}`,
    } as errorResponse;
  } else {
    errorInfo = {
      method,
      status: -3,
      message: `${method}에서 처리할 수 없는 예상치 못한 에러 발생`,
    } as errorResponse;
  }

  return errorInfo;
};

export default handleError;
