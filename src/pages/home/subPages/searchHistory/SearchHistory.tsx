import { useTranslation } from 'react-i18next';
import { Header } from 'pages/home/subPages/components';
import { SearchScrollView } from './components';
import { SearchHistoryAccordion } from './components/SearchHistoryAccordion';
import { MemoSearchTextArea } from '../components/memo/MemoSearchTextArea';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import * as Api from 'api';
import { v4 as uuid_v4 } from 'uuid';

const SEARCH_HISTORY_LIMIT = 15;

const SearchHistoryPage = ({}: {}) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, isLoading } = useInfiniteQuery<
    Api.paginationSearchHistoriesResponse,
    Error
  >({
    queryKey: ['searchHistory', message], // message도 의존성으로 포함
    queryFn: async ({ pageParam = 1 }: any) => {
      const response = await Api.getSearchHistories({
        query: message,
        searchHistoryPage: pageParam,
        searchHistoryLimit: SEARCH_HISTORY_LIMIT,
      });
      if (!Api.isGetSearchHistories(response)) {
        throw new Error('메모 검색 기록을 가져오는 중 오류가 발생했습니다.');
      }
      return response;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.totalPage > lastPage.currentPage
        ? lastPage.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  const searchConversations =
    !isLoading && data
      ? data.pages.flatMap((page) => page.searchHistories ?? [])
      : [];

  useEffect(() => {
    if (!observerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [observerRef.current, fetchNextPage]);

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (message: string) => {
    console.log(message);
  };

  return (
    <div className="flex flex-col flex-1 h-screen bg-custom-gradient-basic">
      <div className="max-w-[740px] pt-24 pb-16 w-full flex flex-col flex-1 overflow-hidden self-center">
        <div className="px-4">
          <Header headerText={t('pages.searchHistory.header')} />
        </div>
        <SearchScrollView
          searchTextArea={
            <MemoSearchTextArea
              value={message}
              onChange={handleMessageChange}
              placeholder={t('pages.searchHistory.inputPlaceholder')}
              onSubmit={() => handleSubmit(message)}
            />
          }
        >
          {searchConversations.map((searchConversation) => (
            <SearchHistoryAccordion
              // FIXME: searchHistory에 key 생기면 삭제
              key={searchConversation?.id || uuid_v4()}
              data={searchConversation}
            />
          ))}
          <div ref={observerRef} />
        </SearchScrollView>
      </div>
    </div>
  );
};

export default SearchHistoryPage;
