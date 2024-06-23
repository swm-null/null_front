interface Memo {
  id: string;
  content: string;
  tags: string[];
}

export interface Answer {
  text: string;
  memos: Memo[] | undefined;
}

export interface SearchQuery {
  id: string;
  query: string;
  answer: Answer;
}