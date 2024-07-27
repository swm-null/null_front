interface response {
  method: string;
  status: number;
}

export interface validResponse extends response {}

export interface errorResponse extends response {
  exceptionCode?: number;
  /**
   * 디버거에 뜨는 내용
   */
  message: string;
}
