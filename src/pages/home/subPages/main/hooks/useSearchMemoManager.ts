import { useState } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import { Status } from '../interfaces';
import * as Api from 'api';
import * as Interface from 'pages/home/subPages/interfaces';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const MAX_SEARCH_QUERIES = 100;

const useSearchMemoManager = ({
  status,
  setStatus,
}: {
  status: Status;
  setStatus: (status: Status) => void;
}) => {
  const queryClient = useQueryClient();
  const [searchAnswer, setSearchAnswer] =
    useState<Interface.MemoSearchConversation>();

  const trySearchMemoAndSetStatus = async (
    message: string,
    setMessage: (message: string) => void
  ) => {
    if (message.trim()) {
      setMessage('');
      setStatus('loading');
      try {
        await mutateAsync(message);
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    }
  };

  const searchMemo = async (
    query: string
  ): Promise<Interface.MemoSearchAnswer> => {
    const response = await Api.searchMemo(query);
    if (!Api.isSearchMemoResponse(response)) {
      throw new Error('Memo Create Error');
    }
    return response;
  };

  const { mutateAsync } = useMutation<
    Interface.MemoSearchAnswer,
    AxiosError,
    string,
    { conversationId: string; conversationQuery: string }
  >({
    mutationFn: searchMemo,
    onMutate: async (query: string) => {
      await queryClient.cancelQueries({
        queryKey: ['searchHistory'],
      });
      const previousMemoSearchConversations =
        queryClient.getQueryData<Interface.MemoSearchConversation[]>([
          'searchHistory',
        ]) || [];

      const optimisticSearchConversation: Interface.MemoSearchConversation = {
        id: uuid_v4(),
        query: query,
        answer: null,
      };
      setSearchAnswer(optimisticSearchConversation);

      queryClient.setQueryData<Interface.MemoSearchConversation[]>(
        ['searchHistory'],
        [optimisticSearchConversation, ...previousMemoSearchConversations]
      );

      return {
        conversationId: optimisticSearchConversation.id,
        conversationQuery: optimisticSearchConversation.query,
      };
    },
    onError: ({ context }: any) => {
      const optimisticMemoId = context?.optimisticMemoId;
      if (optimisticMemoId) {
        queryClient.setQueryData<Interface.Memo[]>(
          ['searchHistory'],
          (oldMemos) =>
            oldMemos?.filter((memo) => memo.id !== optimisticMemoId) || []
        );
      }
    },
    onSettled: (data, _, __, context) => {
      const conversationId = context?.conversationId;
      const conversationQuery = context?.conversationQuery;

      if (data) {
        const updatedSearchAnswer = {
          id: conversationId,
          query: conversationQuery,
          answer: data,
        } as Interface.MemoSearchConversation;

        setSearchAnswer(updatedSearchAnswer);
        // FIXME: searchHistory api연동되면 localhost에 저장하는 이 메소드 삭제.
        saveSearchHistory(updatedSearchAnswer);

        queryClient.setQueryData<Interface.MemoSearchConversation[]>(
          ['searchHistory'],
          (oldSearchHistories) =>
            oldSearchHistories?.map((oldSearchHistory) =>
              oldSearchHistory.id === conversationId
                ? updatedSearchAnswer
                : oldSearchHistory
            ) || []
        );
      } else if (conversationId) {
        queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
      }
    },
  });

  const saveSearchHistory = (
    newSearchAnswer: Interface.MemoSearchConversation
  ) => {
    const searchConversations = JSON.parse(
      localStorage.getItem('search_queries') || '[]'
    );
    searchConversations.unshift(newSearchAnswer);

    if (searchConversations.length > MAX_SEARCH_QUERIES) {
      searchConversations.length = MAX_SEARCH_QUERIES;
    }

    localStorage.setItem('search_queries', JSON.stringify(searchConversations));
  };

  return {
    status,
    searchAnswer,
    trySearchMemoAndSetStatus,
  };
};

export default useSearchMemoManager;
