interface response {
  method: string;
  status: number;
}
export interface validResponse extends response {
  message?: string;
}

export interface errorResponse extends response {
  exceptionCode?: number;
  exceptionMessage?: string;
}
