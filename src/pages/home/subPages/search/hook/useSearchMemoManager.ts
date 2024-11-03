import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { v4 as uuid_v4 } from 'uuid';
import * as Api from 'api';
import * as Interface from 'pages/home/subPages/interfaces';
import { useTranslation } from 'react-i18next';

interface SearchQueryData {
  pages: Api.paginationSearchHistories[];
  pageParams: number[];
}

const SEARCH_HISTORY_LIMIT = 10;

const useSearchMemoManager = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data, fetchNextPage, isLoading } = useInfiniteQuery<
    Api.paginationSearchHistories,
    Error
  >({
    queryKey: ['search'],
    queryFn: async ({ pageParam = 1 }: any) => {
      const response = await Api.getSearchHistories({
        page: pageParam,
        limit: SEARCH_HISTORY_LIMIT,
      });

      if (!Api.isSearchHistoriesResponse(response)) {
        throw new Error(t('pages.search.fetchHistoryErrorMessage'));
      }
      return response as Api.paginationSearchHistories;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.total_page > lastPage.current_page
        ? lastPage.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: 60 * 1000,
  });

  const allSearchHistories =
    !isLoading && data ? data.pages.flatMap((page) => page.search_histories) : [];

  const allSearchQueriesData =
    queryClient.getQueriesData<Api.paginationSearchHistories>({
      queryKey: ['search'],
      exact: false,
    });

  const handleSearchMemo = async (query: string) => {
    const backupData = backupSearchData();
    const tempConversation = createSearchConversationInQueries(query);

    updateSearchDataInQueries(tempConversation);

    try {
      const searchResult = await searchMemo(query);
      const updatedConversation = {
        ...tempConversation,
        search_memos_response: searchResult,
      };
      updateSearchDataInQueries(updatedConversation);
    } catch (error) {
      alert(t('pages.search.searchErrorMessage'));
      const errorResponse: Interface.MemoSearchAnswer = {
        processed_message: t('pages.search.searchErrorDescription'),
        memos: null,
      };
      const errorConversation = {
        ...tempConversation,
        search_memos_response: errorResponse,
      };
      updateSearchDataInQueries(errorConversation);
      restoreSearchData(backupData);
    }
  };

  const backupSearchData = () => {
    const backupData = new Map();
    allSearchQueriesData.forEach((query) => {
      const queryKey = query[0];
      const queryData = query[1];
      if (queryData) {
        backupData.set(queryKey, queryData);
      }
    });
    return backupData;
  };

  const createSearchConversationInQueries = (
    query: string
  ): Interface.MemoSearchConversation => {
    return {
      id: uuid_v4(),
      query: query,
      created_at: new Date().toISOString(),
      search_memos_response: null,
    };
  };

  const updateSearchDataInQueries = (
    newConversation: Interface.MemoSearchConversation
  ) => {
    allSearchQueriesData.forEach((query) => {
      const queryKey = query[0];

      queryClient.setQueryData(queryKey, (oldData: SearchQueryData) => {
        if (!oldData) return oldData;

        const updatedPages = oldData.pages.map((page) => {
          const conversationIndex = page.search_histories.findIndex(
            (conversation) => conversation.id === newConversation.id
          );
          if (conversationIndex !== -1) {
            const updatedHistories = [...page.search_histories];
            updatedHistories[conversationIndex] = newConversation;
            return { ...page, search_histories: updatedHistories };
          }
          return page;
        });
        return { ...oldData, pages: updatedPages };
      });
    });
  };

  const searchMemo = async (query: string): Promise<Interface.MemoSearchAnswer> => {
    const response = await Api.searchMemo(query);
    if (!Api.isSearchMemoResponse(response)) {
      throw new Error('Memo Search Error');
    }
    return response;
  };

  const restoreSearchData = (backupData: Map<string[], SearchQueryData>) => {
    backupData.forEach((data, queryKey) => {
      queryClient.setQueryData(queryKey, data);
    });
  };

  return {
    data: allSearchHistories,
    fetchNextPage,
    handleSearchMemo,
  };
};

export default useSearchMemoManager;
