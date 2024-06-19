import React, { useEffect, useRef, useState } from 'react';
import { SearchInput } from './SearchInput.tsx';
import { SearchScrollView } from './SearchScrollView.tsx';
import { v4 as uuid_v4 } from 'uuid';
import { useInView } from 'react-intersection-observer';


export interface SearchQuery {
  id: string;
  query: string;
  answer: string;
}

const PAGE_SIZE = 10;
const MAX_SEARCH_QUERIES = 100;
const MAX_SEARCH_CHAT = 2 * MAX_SEARCH_QUERIES;

export const SearchPage = () => {
  // cachedViews를 처음 로드할 때만 설정
  const [cachedSearchQueries, setCachedSearchQueries] = useState<SearchQuery[]>(() => JSON.parse(localStorage.getItem('search_queries') || '[]'));
  const [searchQueries, setViews] = useState<SearchQuery[]>([]);
  const [newSearchQueries, setNewSearchQueries] = useState<SearchQuery[]>([]);
  const [currentCachedSearchQueriesPage, setCurrentCachedSearchQueriesPage] = useState(-1);
  const [isCachedSearchQueriesLoading, setIsCachedSearchQueriesLoading] = useState(false);

  const canLoadMoreCachedSearchQueries = () => {
    return (currentCachedSearchQueriesPage+1)*PAGE_SIZE < cachedSearchQueries.length;
  }
  
  const loadCachedSearchQueries = async () => {
    if (canLoadMoreCachedSearchQueries()) {
      setCurrentCachedSearchQueriesPage(prevPage => prevPage+1);
    }
  };

  // scrollView의 끝이 Viewport 안에 들어왔는지 확인하는 메소드
  const handleIntersection = async (inView: boolean) => {
    if (inView && !isCachedSearchQueriesLoading) {
      setIsCachedSearchQueriesLoading(true);
      await loadCachedSearchQueries();
      setIsCachedSearchQueriesLoading(false);
    }
  };

  // IntersectionObserver hook을 사용하여 빈 view 감지
  const { ref: emptyViewRef } = useInView({
    onChange: handleIntersection,
  });

  const addSearchQuery = (text: string) => {
    const answerID = uuid_v4();
    
    setNewSearchQueries((prevViews) => [
      { id: answerID, query: text, answer: '' },
      ...prevViews, 
    ]);

    return answerID;
  };

  const editSearchQuery = (id: string, newText: string) => {
    setNewSearchQueries(prevViews => prevViews.map(view => view.id === id ? { ...view, answer: newText } : view));
    setCachedSearchQueries(prevViews => prevViews.map(view => view.id === id ? { ...view, answer: newText } : view));
  };

  const removeSearchQuery = (id: string) => {
    setNewSearchQueries(prevViews => prevViews.filter(view => view.id !== id));
    setCachedSearchQueries(prevViews => prevViews.filter(view => view.id !== id));
    return id;
  };

  // 화면에 보이는 검색 결과 업데이트
  useEffect(() => {
    const slicedCachedSearchQueries = cachedSearchQueries.slice(0, Math.min((currentCachedSearchQueriesPage+1)*PAGE_SIZE, cachedSearchQueries.length, MAX_SEARCH_CHAT-newSearchQueries.length));
    setViews([
      ...newSearchQueries,
      ...slicedCachedSearchQueries,
    ]);
  }, [newSearchQueries, cachedSearchQueries, currentCachedSearchQueriesPage])

  // 검색 결과 업데이트 될 때마다, localStorage에 저장 (최대 MAX_SEARCH_CHAT개)
  useEffect(() => {
    const temp = [
      ...newSearchQueries,
      ...cachedSearchQueries,
    ];
    localStorage.setItem('search_queries', JSON.stringify(temp.length > MAX_SEARCH_CHAT ? temp.slice(0, MAX_SEARCH_CHAT) : temp))
  }, [newSearchQueries, cachedSearchQueries])

  return (
    <div className='flex flex-col h-screen'>
      <div className='px-4 py-4'>
        <h1>챗봇으로 메모 검색하기</h1>
      </div>
      <SearchScrollView removeSearchQuery={removeSearchQuery} lastElementRef={emptyViewRef} searchQueries={searchQueries}/>
      <SearchInput addSearchQuery={addSearchQuery} editSearchQuery={editSearchQuery}/>
    </div>
  );
};