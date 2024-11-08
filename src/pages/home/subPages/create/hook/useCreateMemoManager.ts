import { useState } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import * as Api from 'api';
import * as Interface from 'pages/home/subPages/interfaces';
import { Status } from 'pages/home/subPages/types';

const useCreateMemoManager = () => {
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<Status>('default');

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
      staleTime: 10 * 1000,
      refetchInterval: () => (document.hidden ? false : 10 * 1000),
    });

  const allMemos =
    !isLoading && data ? data.pages.flatMap((page) => page.memos ?? []) : [];

  const handleCreateMemo = async (message: string, images?: File[]) => {
    try {
      const imageUrls = images ? await getImageUrls(images) : [];
      await createMemo({ message, images: imageUrls });
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  const getImageUrls = async (images: File[]): Promise<string[]> => {
    if (images.length === 0) return [];

    const response =
      images.length === 1
        ? await Api.uploadFile(images[0])
        : await Api.uploadFiles(images);
    if (!Api.isFilesResponse(response))
      throw new Error('파일 업로드에 문제가 생겼습니다.');

    return response.urls;
  };

  const createMemo = async ({
    message,
    images,
  }: {
    message: string;
    images?: string[];
  }) => {
    const temporaryMemo = await createTemporaryMemo({ message, images });
    addMemoInQueries(temporaryMemo);

    try {
      const response = await Api.createMemo(message, images);

      if (Api.isCreateMemoResponse(response)) {
        updateMemoInQueries(temporaryMemo.id, response as Interface.Memo);
      } else {
        throw new Error('Memo Create Error');
      }
    } catch (error) {
      deleteMemoInQueries(temporaryMemo.id);
    }
  };

  const createTemporaryMemo = async ({
    message,
    images,
    voices,
  }: {
    message: string;
    images?: string[];
    voices?: string[];
  }) => {
    const optimisticMemo: Interface.Memo = {
      id: uuid_v4(),
      content: message,
      image_urls: images || [],
      voice_urls: voices || [],
      metadata: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: [],
    };

    return optimisticMemo;
  };

  const addMemoInQueries = (memo: Interface.Memo) => {
    queryClient.setQueryData<unknown>(['recentMemo'], (oldData: any) => {
      return {
        pages: oldData?.pages.map((page: any) => ({
          ...page,
          memos: [memo, ...page?.memos],
        })),
        pageParams: oldData?.pageParams as any,
      };
    });
  };

  const updateMemoInQueries = (
    optimisticMemoId: string,
    updateMemo: Interface.Memo
  ) => {
    queryClient.setQueryData<unknown>(['recentMemo'], (oldData: any) => {
      return {
        pages: oldData?.pages.map((page: any) => ({
          ...page,
          memos: page?.memos.map((memo: any) =>
            memo.id === optimisticMemoId ? updateMemo : memo
          ),
        })),
        pageParams: oldData?.pageParams as any,
      };
    });
  };

  const deleteMemoInQueries = (optimisticMemoId: string) => {
    if (optimisticMemoId) {
      queryClient.setQueryData<Interface.Memo[]>(
        ['recentMemo'],
        (oldMemos) => oldMemos?.filter((memo) => memo.id !== optimisticMemoId) || []
      );
    }
  };

  return {
    data: allMemos,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    handleCreateMemo,
  };
};

export default useCreateMemoManager;
