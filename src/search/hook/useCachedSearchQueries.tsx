import { useState, useEffect } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import { MemoSearchAnswer, MemoSearchConversation } from '../../interface/MemoInterface';

const MAX_SEARCH_QUERIES = 100;
export const useCachedSearchQueries = () => {
  // searchConversations: 화면에서 보이는 검색 결과를 저장
  // 화면을 불러왔을 때, localStorage에서 가져온, 이전에 검색한 결과
  const [searchConversations, setSearchConversations] = useState<MemoSearchConversation[]>(() => JSON.parse(localStorage.getItem('search_queries') || '[]'));

  // Search Query 추가, 수정, 삭제 작업을 위한 코드
  // 나중에 디버깅을 위해 항상 id를 리턴
  const addSearchConversation = (text: string) => {
    const answerID = uuid_v4();
    setSearchConversations((prevViews) => [
      { id: answerID, query: text, answer: { text: '', memos: null } },
      ...(prevViews.length > MAX_SEARCH_QUERIES) ? prevViews.slice(0,-1) : prevViews,
    ]);
    return answerID;
  };

  const editSearchConversation = (id: string, newMemoSearchAnswer: MemoSearchAnswer) => {
    setSearchConversations(prevViews => prevViews.map(view => view.id === id ? { ...view, answer: newMemoSearchAnswer } : view));
    return id;
  };

  const removeSearchConversation = (id: string) => {
    setSearchConversations(prevViews => prevViews.filter(view => view.id !== id));
    return id;
  };

  // 변경사항이 있을 경우, localStorage에 저장
  useEffect(() => {
    localStorage.setItem('search_queries', JSON.stringify(searchConversations));
  }, [searchConversations]);

  return {
    searchConversations,
    addSearchConversation,
    editSearchConversation,
    removeSearchConversation,
  };
};
