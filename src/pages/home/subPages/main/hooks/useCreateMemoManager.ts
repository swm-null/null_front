import { useState } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import { Status } from '../interfaces';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as Api from 'api';
import * as Interface from 'pages/home/subPages/interfaces';

const useCreateMemoManager = ({
  status,
  setStatus,
}: {
  status: Status;
  setStatus: (status: Status) => void;
}) => {
  const queryClient = useQueryClient();
  const [page] = useState<number>(0);

  const useMemoStack = () => {
    return useQuery({
      queryKey: ['memos', page],
      queryFn: async () => {
        const response = await Api.getAllMemos(page);
        if (!Api.isValidResponse(response)) {
          throw new Error('메모를 가져오는 중 오류가 발생했습니다.');
        }
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

  const createTemporaryMemo = async (content: string) => {
    await queryClient.cancelQueries({ queryKey: ['memos', page] });
    const previousMemos =
      queryClient.getQueryData<Interface.Memo[]>(['memos', page]) || [];

    const optimisticMemo: Interface.Memo = {
      id: uuid_v4(),
      content: content,
      image_urls: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: [],
    };

    queryClient.setQueryData<Interface.Memo[]>(
      ['memos', page],
      [optimisticMemo, ...previousMemos]
    );

    return { optimisticMemoId: optimisticMemo.id };
  };

  const deleteTemporaryMemo = (
    _: AxiosError<unknown, any>,
    __: string,
    context: { optimisticMemoId: string } | undefined
  ) => {
    // TODO: 태그 생성하다 오류나면 어떻게 처리하지? 왠지 front에서 메모 재생성하기 기능이 있어야할 것 같은데
    // 지금은 그냥 안보이게 설정함
    const optimisticMemoId = context?.optimisticMemoId;
    if (optimisticMemoId) {
      queryClient.setQueryData<Interface.Memo[]>(
        ['memos', page],
        (oldMemos) =>
          oldMemos?.filter((memo) => memo.id !== optimisticMemoId) || []
      );
    }
  };

  const updateTemporaryMemoData = (
    data: Interface.Memo | undefined,
    _: AxiosError<unknown, any> | null,
    __: string,
    context: { optimisticMemoId: string } | undefined
  ) => {
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
  };

  const { mutateAsync } = useMutation<
    Interface.Memo,
    AxiosError,
    string,
    { optimisticMemoId: string }
  >({
    mutationFn: createMemo,
    onMutate: createTemporaryMemo,
    onError: deleteTemporaryMemo,
    onSettled: updateTemporaryMemoData,
  });

  return {
    status,
    useMemoStack,
    tryCreateMemoAndSetStatus,
  };
};

export default useCreateMemoManager;
