import { useState, useEffect } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import { useInView } from 'react-intersection-observer';
import { Answer, SearchQuery } from '../interface/SearchResultInterface';

const PAGE_SIZE = 10;
const MAX_SEARCH_QUERIES = 100;
const MAX_SEARCH_CHAT = 2 * MAX_SEARCH_QUERIES;

export const useCachedSearchQueries = () => {
  // searchQueries: 화면에서 보이는 검색 결과를 저장
  // newSearchQueries, cachedSeachQueries가 바뀔때만 변경
  const [searchQueries, setSearchQueries] = useState<SearchQuery[]>([]);
  // 화면을 불러온 후, 추가 검색한 결과
  const [newSearchQueries, setNewSearchQueries] = useState<SearchQuery[]>([]);
  // 화면을 불러왔을 때, localStorage에서 가져온, 이전에 검색한 결과
  const [cachedSearchQueries, setCachedSearchQueries] = useState<SearchQuery[]>(() => JSON.parse(localStorage.getItem('search_queries') || '[]'));
  // cache 데이터를 얼마나 보여줄 지 정해주는 숫자. 현재 보여주는 캐쉬 데이터의 페이지를 저장
  const [currentCachedSearchQueriesPage, setCurrentCachedSearchQueriesPage] = useState(-1);
  const [isCachedSearchQueriesLoading, setIsCachedSearchQueriesLoading] = useState(false);

  // Search Query 추가, 수정, 삭제 작업을 위한 코드
  // 나중에 디버깅을 위해 항상 id를 리턴
  const addSearchQuery = (text: string) => {
    const answerID = uuid_v4();
    setNewSearchQueries((prevViews) => [
      { id: answerID, query: text, answer: { text: '', memos: undefined } },
      ...prevViews,
    ]);
    return answerID;
  };

  const editSearchQuery = (id: string, newAnswer: Answer) => {
    setNewSearchQueries(prevViews => prevViews.map(view => view.id === id ? { ...view, answer: newAnswer } : view));
    setCachedSearchQueries(prevViews => prevViews.map(view => view.id === id ? { ...view, answer: newAnswer } : view));
    return id;
  };

  const removeSearchQuery = (id: string) => {
    setNewSearchQueries(prevViews => prevViews.filter(view => view.id !== id));
    setCachedSearchQueries(prevViews => prevViews.filter(view => view.id !== id));
    return id;
  };

  // 추가 캐쉬를 불러올수 있는지 확인
  const canLoadMoreCachedSearchQueries = () => {
    return (currentCachedSearchQueriesPage+1) * PAGE_SIZE < cachedSearchQueries.length;
  };

  // 추가 캐쉬를 불러올 수 있는지 확인하고, 변경된 캐쉬를 화면에서 볼 수 있게, page를 수정
  const tryLoadCachedSearchQueries = async (inView: boolean) => {
    if (inView && !isCachedSearchQueriesLoading) {
      setIsCachedSearchQueriesLoading(true);
      if (canLoadMoreCachedSearchQueries()) {
        setCurrentCachedSearchQueriesPage(prevPage => prevPage + 1);
      }
      setIsCachedSearchQueriesLoading(false);
    }
  };

  // 해당 참조의 컴퍼넌트가 화면에 보이면 추가 데이터를 로딩
  const { ref: emptyViewRef } = useInView({
    onChange: tryLoadCachedSearchQueries,
  });

  // 보여지는 결과 창 업데이트
  useEffect(() => {
    // 화면에서 보여줄 cache 데이터 설정
    // 보여지는 cached data는 선택한 페이지의 캐쉬, 
    // cachedSearchQueries.length(선택한 페이지의 캐쉬 > cachedSearchQueries의 크기인 경우),
    // 최대 보여줄 수 있는 cache data 개수 중 작은 것을 택 1
    const slicedCachedSearchQueries = cachedSearchQueries.slice(0, 
      Math.min(
        (currentCachedSearchQueriesPage+1)*PAGE_SIZE, 
        cachedSearchQueries.length, 
        MAX_SEARCH_CHAT-newSearchQueries.length));
    setSearchQueries([
      ...newSearchQueries,
      ...slicedCachedSearchQueries,
    ]);
  }, [newSearchQueries, cachedSearchQueries, currentCachedSearchQueriesPage]);

  // 변경사항이 있을 경우, localStorage에 저장
  useEffect(() => {
    const temp = [
      ...newSearchQueries,
      ...cachedSearchQueries,
    ];
    const slicedTemp = temp.length > MAX_SEARCH_CHAT ? temp.slice(0, MAX_SEARCH_CHAT) : temp;
    localStorage.setItem('search_queries', JSON.stringify(slicedTemp));
  }, [newSearchQueries, cachedSearchQueries]);

  return {
    searchQueries,
    addSearchQuery,
    editSearchQuery,
    removeSearchQuery,
    emptyViewRef,
  };
};
