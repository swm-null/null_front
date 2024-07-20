import { Memo } from 'pages/home/contents/@interfaces/MemoInterface';

/**
 * 메모 검색 기능 사용 후 받은 대답 객체
 */
export interface MemoSearchAnswer {
  text: string;
  /**
   * 관련 메모 대신 자연어(text에 들어가는 내용)로 대답이 오는 경우도 있기 때문에 null 처리
   */
  memos: Memo[] | null;
}

/**
 * 메모 검색 질문 Query와 메모 검색 결과를 id와 함께 저장하는 객체
 */
export interface MemoSearchConversation {
  id: string;
  /**
   * 메모 검색 질문
   */
  query: string;
  /**
   * 메모 검색 질문에 대한 대답
   */
  answer: MemoSearchAnswer;
}
