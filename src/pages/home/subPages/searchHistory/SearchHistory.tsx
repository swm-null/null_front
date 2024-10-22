import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchScrollView, SearchHistoryAccordion } from './components';
import { MemoSearchTextArea } from '../components';
import { useInfiniteQuery } from '@tanstack/react-query';
import * as Api from 'api';
import { v4 as uuid_v4 } from 'uuid';
import { debounceTime, Subject, switchMap } from 'rxjs';

const SEARCH_HISTORY_LIMIT = 15;

const input$ = new Subject();

const SearchHistoryPage = ({}: {}) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

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
    staleTime: 60 * 1000,
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
      <div className="max-w-[740px] w-full h-full flex flex-col flex-1 overflow-hidden self-center">
        <MemoSearchTextArea
          value={message}
          onChange={handleMessageChange}
          placeholder={t('pages.searchHistory.inputPlaceholder')}
          onSubmit={handleSubmit}
        />
        <SearchScrollView fetchNextPage={fetchNextPage}>
          {searchConversations.map((searchConversation) => (
            <SearchHistoryAccordion
              // FIXME: searchHistory에 key 생기면 삭제
              key={searchConversation?.id || uuid_v4()}
              data={searchConversation}
            />
          ))}
        </SearchScrollView>
      </div>
    </div>
  );
};

export default SearchHistoryPage;
