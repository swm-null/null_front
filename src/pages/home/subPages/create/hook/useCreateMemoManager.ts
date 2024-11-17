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
      staleTime: 600000,
    });

  const allMemos =
    !isLoading && data ? data.pages.flatMap((page) => page.memos ?? []) : [];

  const handleCreateMemo = async (
    message: string,
    images: File[],
    imagesLocalUrls: string[],
    voice: File | null
  ) => {
    try {
      const temporaryMemo = await createTemporaryMemo({
        message,
        images: imagesLocalUrls,
      });
      addMemoInQueries(temporaryMemo);

      const imageUrls = await getFileUrls(images);
      const voiceUrls = await getFileUrls(voice ? [voice] : []);

      temporaryMemo.image_urls = imageUrls;
      temporaryMemo.voice_urls = voiceUrls;
      updateMemoInQueries(temporaryMemo.id, temporaryMemo);

      await createMemo({ temporaryMemo, message, images: imageUrls, voiceUrls });
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  const getFileUrls = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    const response =
      files.length === 1
        ? await Api.uploadFile(files[0])
        : await Api.uploadFiles(files);
    if (!Api.isFilesResponse(response))
      throw new Error('파일 업로드에 문제가 생겼습니다.');

    return response.urls;
  };

  const createMemo = async ({
    temporaryMemo,
    message,
    images,
    voiceUrls,
  }: {
    temporaryMemo: Interface.Memo;
    message: string;
    images?: string[];
    voiceUrls?: string[];
  }) => {
    try {
      const response = await Api.createMemo(message, images, voiceUrls);

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
