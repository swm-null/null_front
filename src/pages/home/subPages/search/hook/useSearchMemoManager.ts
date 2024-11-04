import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { v4 as uuid_v4 } from 'uuid';
import * as Api from 'api';
import * as Interface from 'pages/home/subPages/interfaces';
import { useTranslation } from 'react-i18next';

const SEARCH_HISTORY_LIMIT = 10;
const SEARCH_QUERY_KEY = ['search'] as const;

interface SearchQueryData {
  pages: Api.paginationSearchHistories[];
  pageParams: number[];
}

const useSearchMemoManager = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data, fetchNextPage, isLoading } = useInfiniteQuery<
    Api.paginationSearchHistories,
    Error
  >({
    queryKey: SEARCH_QUERY_KEY,
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

  const handleSearchMemo = async (query: string) => {
    const backupData = backupSearchData();
    const tempConversation = createSearchConversationInQueries(query);

    addSearchHistoryInQueries(tempConversation);

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
    const data = queryClient.getQueryData<SearchQueryData>(SEARCH_QUERY_KEY);
    return data ? { queryKey: SEARCH_QUERY_KEY, data } : null;
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

  const addSearchHistoryInQueries = (
    conversation: Interface.MemoSearchConversation
  ) => {
    queryClient.setQueryData(SEARCH_QUERY_KEY, (oldData: SearchQueryData) => {
      if (!oldData) return oldData;

      const updatedPages = [...oldData.pages];
      if (updatedPages[0]) {
        updatedPages[0] = {
          ...updatedPages[0],
          search_histories: [conversation, ...updatedPages[0].search_histories],
        };
      }

      return { ...oldData, pages: updatedPages };
    });
  };

  const updateSearchDataInQueries = (
    newConversation: Interface.MemoSearchConversation
  ) => {
    queryClient.setQueryData(SEARCH_QUERY_KEY, (oldData: SearchQueryData) => {
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
  };

  const searchMemo = async (query: string): Promise<Interface.MemoSearchAnswer> => {
    const response = await Api.searchMemo(query);
    if (!Api.isSearchMemoResponse(response)) {
      throw new Error('Memo Search Error');
    }
    return response;
  };

  const restoreSearchData = (
    backupData: { queryKey: readonly string[]; data: SearchQueryData } | null
  ) => {
    if (!backupData) return;

    const { queryKey, data } = backupData;
    queryClient.setQueryData(queryKey, data);
  };

  return {
    data: allSearchHistories,
    fetchNextPage,
    handleSearchMemo,
  };
};

export default useSearchMemoManager;
