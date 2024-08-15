interface response {
  method: string;
  status: number;
  /**
   * 답변 혹은 오류 시 오류 내용
   */
  message?: string;
}
export interface validResponse extends response {}

export interface errorResponse extends response {
  exceptionMessage?: string;
}
