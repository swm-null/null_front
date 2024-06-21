import { Answer } from "./Answer";

export interface SearchQuery {
  id: string;
  query: string;
  answer: Answer;
}