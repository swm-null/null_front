import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
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
    staleTime: 600000,
    gcTime: 900000,
    refetchOnMount: true,
  });

  const allSearchHistories =
    !isLoading && data ? data.pages.flatMap((page) => page.search_histories) : [];

  const handleSearchMemo = async (query: string) => {
    try {
      const searchResult = await handleSearchInit(query);
      await Promise.all([
        handleSearchWithDB(searchResult.id),
        handleSearchWithAI(searchResult.id),
      ]);
    } catch (error) {
      alert(t('pages.search.searchErrorMessage'));
    }
  };

  const handleSearchInit = async (query: string) => {
    const response = await searchMemoInit(query);
    if (!Api.isSearchInitResponse(response)) {
      throw new Error('Memo Search Error');
    }

    const tempConversation = createSearchConversationInQueries(response.id, query);
    addSearchHistoryInQueries(tempConversation);

    return response;
  };

  const searchMemoInit = async (query: string) => {
    const response = await Api.searchMemo(query);
    if (!Api.isSearchInitResponse(response)) {
      throw new Error('Memo Search Error');
    }
    return response;
  };

  const handleSearchWithDB = async (searchHistoryId: string) => {
    try {
      const response = await searchMemoWithDB(searchHistoryId);
      if (!Api.isSearchMemoWithDBResponse(response)) {
        throw new Error('Memo Search Error');
      }
      updateSearchDataWithDBInQueries(searchHistoryId, response);
    } catch (error) {
      const dbErrorResponse: Interface.MemoSearchAnswerWithDB = {
        loading: false,
        memos: [],
      };
      updateSearchDataWithDBInQueries(searchHistoryId, dbErrorResponse);
    }
  };

  const searchMemoWithDB = async (searchHistoryId: string) => {
    const response = await Api.searchMemoWithDB(searchHistoryId);
    if (!Api.isSearchMemoWithDBResponse(response)) {
      throw new Error('Memo Search Error');
    }
    return response;
  };

  const handleSearchWithAI = async (searchHistoryId: string) => {
    try {
      const response = await searchMemoWithAI(searchHistoryId);
      if (!Api.isSearchMemoWithAIResponse(response)) {
        throw new Error('Memo Search Error');
      }
      updateSearchDataWithAIInQueries(searchHistoryId, response);
    } catch (error) {
      const aiErrorResponse: Interface.MemoSearchAnswerWithAI = {
        loading: false,
        processed_message: null,
        memos: null,
      };
      updateSearchDataWithAIInQueries(searchHistoryId, aiErrorResponse);
    }
  };

  const searchMemoWithAI = async (searchHistoryId: string) => {
    const response = await Api.searchMemoWithAI(searchHistoryId);
    if (!Api.isSearchMemoWithAIResponse(response)) {
      throw new Error('Memo Search Error');
    }
    return response;
  };

  const createSearchConversationInQueries = (
    id: string,
    query: string
  ): Interface.MemoSearchConversation => {
    return {
      id: id,
      query: query,
      created_at: new Date().toISOString(),
      ai: {
        loading: true,
        processed_message: null,
        memos: [],
      },
      db: {
        loading: true,
        memos: [],
      },
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

  const updateSearchDataWithAIInQueries = (
    conversationId: string,
    newAIAnswer: Interface.MemoSearchAnswerWithAI
  ) => {
    queryClient.setQueryData(SEARCH_QUERY_KEY, (oldData: SearchQueryData) => {
      const updatedPages = oldData.pages.map((page) => {
        const updatedHistories = page.search_histories.map((history) => {
          if (history.id === conversationId) {
            return {
              ...history,
              ai: newAIAnswer,
            };
          }
          return history;
        });
        return { ...page, search_histories: updatedHistories };
      });
      return { ...oldData, pages: updatedPages };
    });
  };

  const updateSearchDataWithDBInQueries = (
    conversationId: string,
    newDBAnswer: Interface.MemoSearchAnswerWithDB
  ) => {
    queryClient.setQueryData(SEARCH_QUERY_KEY, (oldData: SearchQueryData) => {
      const updatedPages = oldData.pages.map((page) => {
        const updatedHistories = page.search_histories.map((history) => {
          if (history.id === conversationId) {
            return {
              ...history,
              db: newDBAnswer,
            };
          }
          return history;
        });
        return { ...page, search_histories: updatedHistories };
      });
      return { ...oldData, pages: updatedPages };
    });
  };

  return {
    data: allSearchHistories,
    fetchNextPage,
    handleSearchMemo,
  };
};

export default useSearchMemoManager;
