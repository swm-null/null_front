interface Memo {
  id: string;
  content: string;
  tags: string[];
}

export interface Answer {
  text: string;
  memos: Memo[] | undefined;
}