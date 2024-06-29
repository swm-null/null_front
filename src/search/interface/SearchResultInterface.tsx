export interface Memo {
  id: string;
  content: string;
  tags: string[];
}

export interface Answer {
  text: string;
  memos: Memo[] | null;
}

export interface SearchQuery {
  id: string;
  query: string;
  answer: Answer;
}