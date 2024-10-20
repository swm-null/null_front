import { v4 as uuid_v4 } from 'uuid';
import { Status } from '../interfaces';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
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

  const useMemoStack = () => {
    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
      useInfiniteQuery<Api.paginationMemosResponse, Error>({
        queryKey: ['recentMemo'],
        queryFn: async ({ pageParam = 1 }: any) => {
          const response = await Api.getRecentMemos(pageParam, 10);
          if (!Api.isMemosResponse(response)) {
            throw new Error('메모를 가져오는 중 오류가 발생했습니다.');
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

    const allMemos =
      !isLoading && data ? data.pages.flatMap((page) => page.memos ?? []) : [];

    return {
      data: allMemos,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    };
  };

  const tryCreateMemoAndSetStatus = async (
    message: string,
    setMessage: (message: string) => void,
    images?: string[]
  ) => {
    if (message.trim() || images?.length) {
      setMessage('');
      setStatus('loading');

      try {
        await mutateAsync({ message, images });
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    }
  };

  const createMemo = async ({
    message,
    images,
  }: {
    message: string;
    images?: string[];
  }): Promise<Interface.Memo> => {
    const response = await Api.createMemo(message, images);
    if (!Api.isValidResponse(response)) {
      throw new Error('Memo Create Error');
    }
    return response;
  };

  const createTemporaryMemo = async ({
    message,
    images,
  }: {
    message: string;
    images?: string[];
  }) => {
    await queryClient.cancelQueries({ queryKey: ['recentMemo'] });

    const optimisticMemo: Interface.Memo = {
      id: uuid_v4(),
      content: message,
      image_urls: images || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: [],
    };

    queryClient.setQueryData<unknown>(['recentMemo'], (oldData: any) => {
      return {
        pages: oldData?.pages.map((page: any) => ({
          ...page,
          memos: [optimisticMemo, ...page?.memos],
        })),
        pageParams: oldData?.pageParams as any,
      };
    });

    return { optimisticMemoId: optimisticMemo.id };
  };

  const deleteTemporaryMemo = (
    _: AxiosError<unknown, any>,
    __: { message: string; images?: string[] },
    context: { optimisticMemoId: string } | undefined
  ) => {
    const optimisticMemoId = context?.optimisticMemoId;
    if (optimisticMemoId) {
      queryClient.setQueryData<Interface.Memo[]>(
        ['recentMemo'],
        (oldMemos) =>
          oldMemos?.filter((memo) => memo.id !== optimisticMemoId) || []
      );
    }
  };

  const updateTemporaryMemoData = (
    data: Interface.Memo | undefined,
    _: AxiosError<unknown, any> | null,
    __: { message: string; images?: string[] },
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

      queryClient.setQueryData<unknown>(['recentMemo'], (oldData: any) => {
        return {
          pages: oldData?.pages.map((page: any) => ({
            ...page,
            memos: page?.memos.map((memo: any) =>
              memo.id === optimisticMemoId ? updatedMemo : memo
            ),
          })),
          pageParams: oldData?.pageParams as any,
        };
      });
    } else if (optimisticMemoId) {
      queryClient.invalidateQueries({ queryKey: ['recentMemo'] });
    }
  };

  const { mutateAsync } = useMutation<
    Interface.Memo,
    AxiosError,
    { message: string; images?: string[] },
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
