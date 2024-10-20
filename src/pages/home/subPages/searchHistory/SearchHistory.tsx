import { useTranslation } from 'react-i18next';
import { Header } from 'pages/home/subPages/components';
import { SearchScrollView } from './components';
import { SearchHistoryAccordion } from './components/SearchHistoryAccordion';
import { MemoSearchTextArea } from '../components/memo/MemoSearchTextArea';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import * as Api from 'api';
import { v4 as uuid_v4 } from 'uuid';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { useIntersectionObserver } from '../hooks';

const SEARCH_HISTORY_LIMIT = 15;

const input$ = new Subject();
const SearchHistoryPage = ({}: {}) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, isLoading, refetch } = useInfiniteQuery<
    Api.paginationSearchHistoriesResponse,
    Error
  >({
    queryKey: ['searchHistory', message],
    queryFn: async ({ pageParam = 1 }: any) => {
      const response = await Api.getSearchHistories({
        query: message,
        page: pageParam,
        limit: SEARCH_HISTORY_LIMIT,
      });

      if (!Api.isSearchHistoriesResponse(response)) {
        throw new Error('메모 검색 기록을 가져오는 중 오류가 발생했습니다.');
      }
      return response;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.total_page > lastPage.current_page
        ? lastPage.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  const searchConversations =
    !isLoading && data
      ? data.pages.flatMap((page) => page.search_histories ?? [])
      : [];

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    input$.next(newMessage);
  };

  useIntersectionObserver(observerRef, {
    callback: (entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    },
    options: { threshold: 0.5 },
  });

  const handleSubmit = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const subscription = input$
      .pipe(
        debounceTime(300),
        switchMap(() => {
          return refetch();
        })
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [refetch]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-full">
      <div className="max-w-[740px] w-full flex flex-col flex-1 overflow-hidden self-center">
        <div className="px-4">
          <Header headerText={t('pages.searchHistory.header')} />
        </div>
        <SearchScrollView
          searchTextArea={
            <MemoSearchTextArea
              value={message}
              onChange={handleMessageChange}
              placeholder={t('pages.searchHistory.inputPlaceholder')}
              onSubmit={handleSubmit}
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
