import { useState } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import { Status } from '../interfaces';
import * as Api from 'api';
import * as Interface from 'pages/home/subPages/interfaces';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

const MAX_SEARCH_QUERIES = 100;

const useSearchMemoManager = ({
  status,
  setStatus,
}: {
  status: Status;
  setStatus: (status: Status) => void;
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchConversation, setSearchConversation] =
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

  const createTemporarySearchConversation = async (query: string) => {
    await queryClient.cancelQueries({
      queryKey: ['searchHistory'],
    });

    const optimisticSearchConversation: Interface.MemoSearchConversation = {
      id: uuid_v4(),
      query: query,
      created_at: '',
      search_memos_response: null,
    };
    setSearchConversation(optimisticSearchConversation);

    return {
      conversationId: optimisticSearchConversation.id,
      conversationQuery: optimisticSearchConversation.query,
      conversationCreatedAt: optimisticSearchConversation.created_at,
    };
  };

  const createErrorAnswer = (
    _: AxiosError<unknown, any>,
    __: string,
    context:
      | {
          conversationId: string;
          conversationQuery: string;
          conversationCreatedAt: string;
        }
      | undefined
  ) => {
    const conversationId = context?.conversationId;
    const conversationQuery = context?.conversationQuery;
    const conversationCreatedAt = context?.conversationCreatedAt;

    if (conversationId) {
      const updatedSearchConversation = {
        id: conversationId,
        query: conversationQuery,
        created_at: conversationCreatedAt,
        search_memos_response: {
          processed_message: t('utils.auth.serverError'),
          memos: [],
        },
      } as Interface.MemoSearchConversation;

      setSearchConversation(updatedSearchConversation);
    }
  };

  const updateSearchConversationAndSaveSearchHistory = (
    data: Interface.MemoSearchAnswer | undefined,
    _: AxiosError<unknown, any> | null,
    __: string,
    context: { conversationId: string; conversationQuery: string } | undefined
  ) => {
    const conversationId = context?.conversationId;
    const conversationQuery = context?.conversationQuery;

    if (data) {
      const updatedSearchConversation = {
        id: conversationId,
        query: conversationQuery,
        created_at: '',
        search_memos_response: data,
      } as Interface.MemoSearchConversation;

      setSearchConversation(updatedSearchConversation);
      // FIXME: searchHistory api연동되면 localhost에 저장하는 이 메소드 삭제.
      saveSearchHistory(updatedSearchConversation);

      queryClient.setQueryData<Interface.MemoSearchConversation[]>(
        ['searchHistory'],
        (oldSearchHistories) =>
          oldSearchHistories?.filter(
            (oldSearchHistory) => oldSearchHistory.id !== conversationId
          ) || []
      );
    } else if (conversationId) {
      queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
    }
  };

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

  const { mutateAsync } = useMutation<
    Interface.MemoSearchAnswer,
    AxiosError,
    string,
    {
      conversationId: string;
      conversationQuery: string;
      conversationCreatedAt: string;
    }
  >({
    mutationFn: searchMemo,
    onMutate: createTemporarySearchConversation,
    onError: createErrorAnswer,
    onSettled: updateSearchConversationAndSaveSearchHistory,
  });

  return {
    status,
    searchConversation,
    trySearchMemoAndSetStatus,
  };
};

export default useSearchMemoManager;
