import { useState, useEffect } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import { Mode, Status } from '../interfaces';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as Api from 'api';
import * as Interface from 'pages/home/subPages/interfaces';

const MAX_SEARCH_QUERIES = 100;

const useCreateSearchMemoManager = (mode: Mode) => {
  const [searchAnswer, setSearchAnswer] =
    useState<Interface.MemoSearchConversation>();
  const [status, setStatus] = useState<Status>('default');
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    setStatus('default'); // mode가 변경될 때마다 status를 초기화
  }, [mode]);

  const useMemoStack = () => {
    return useQuery({
      queryKey: ['memos', page],
      queryFn: async () => {
        const response = await Api.getAllMemos(page);
        if (!Api.isValidResponse(response)) {
          throw new Error('메모를 가져오는 중 오류가 발생했습니다.');
        }
        console.log(response);
        return response.memos;
      },
    });
  };

  const tryCreateMemoAndSetStatus = async (
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

  const createMemo = async (message: string): Promise<Interface.Memo> => {
    const response = await Api.createMemo(message);
    if (!Api.isValidResponse(response)) {
      throw new Error('Memo Create Error');
    }
    return response;
  };

  const { mutateAsync } = useMutation<
    Interface.Memo,
    AxiosError,
    string,
    { optimisticMemoId: string; previousMemos: Interface.Memo[] | undefined }
  >({
    mutationFn: createMemo,
    onMutate: async (newMessage: string) => {
      await queryClient.cancelQueries({ queryKey: ['memos', page] });
      const previousMemos =
        queryClient.getQueryData<Interface.Memo[]>(['memos', page]) || [];

      const optimisticMemo: Interface.Memo = {
        id: uuid_v4(),
        content: newMessage,
        image_urls: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: [],
      };

      queryClient.setQueryData<Interface.Memo[]>(
        ['memos', page],
        [optimisticMemo, ...previousMemos]
      );

      return { optimisticMemoId: optimisticMemo.id, previousMemos };
    },
    onError: ({ context }: any) => {
      const optimisticMemoId = context?.optimisticMemoId;
      if (optimisticMemoId) {
        queryClient.setQueryData<Interface.Memo[]>(
          ['memos', page],
          (oldMemos) =>
            oldMemos?.filter((memo) => memo.id !== optimisticMemoId) || []
        );
      }
    },
    onSettled: (data, _, __, context) => {
      const optimisticMemoId = context?.optimisticMemoId;

      if (data) {
        const updatedMemo = {
          id: data.id,
          content: data.content,
          image_urls: data.image_urls,
          created_at: data.created_at,
          updated_at: data.updated_at,
          tags: data.tags,
        };

        queryClient.setQueryData<Interface.Memo[]>(
          ['memos', page],
          (oldMemos) =>
            oldMemos?.map((memo) =>
              memo.id === optimisticMemoId ? updatedMemo : memo
            ) || []
        );
      } else if (optimisticMemoId) {
        queryClient.invalidateQueries({ queryKey: ['memos', page] });
      }
    },
  });

  const trySearchMemoAndSetStatus = async (
    message: string,
    setMessage: (message: string) => void
  ) => {
    if (message.trim()) {
      setMessage('');
      setStatus('loading');
      try {
        const answer = await getSearchResponse(message);
        const newSearchAnswer = {
          id: uuid_v4(),
          query: message,
          answer: answer,
        };
        saveSearchHistory(newSearchAnswer);
        setSearchAnswer(newSearchAnswer);
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    }
  };

  const getSearchResponse = async (text: string) => {
    const response = await Api.searchMemo(text);

    if (!Api.isValidResponse(response)) {
      return {
        text: '검색을 하는 과정에서 오류가 났습니다. 새로 고침 후 다시 검색해주세요',
        memos: null,
      };
    }

    if (Api.isSearchMemoResponse(response)) {
      return {
        text: response.text,
        memos: response.memos,
      };
    }

    throw new Error('Unexpected response format');
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

  return {
    status,
    searchAnswer,
    useMemoStack,
    tryCreateMemoAndSetStatus,
    trySearchMemoAndSetStatus,
  };
};

export default useCreateSearchMemoManager;
