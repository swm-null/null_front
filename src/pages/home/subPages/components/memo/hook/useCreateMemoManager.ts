import { v4 as uuid_v4 } from 'uuid';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import * as Api from 'api';
import * as Interface from 'pages/home/subPages/interfaces';

const useCreateMemoManager = () => {
  const queryClient = useQueryClient();

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

  const handleCreateLinkedMemo = async (
    tag: Interface.Tag,
    message: string,
    images: File[],
    imagesLocalUrls: string[],
    voice: File | null,
    voiceLocalUrl: string[]
  ) => {
    try {
      const temporaryMemo = await createTemporaryMemo({
        message,
        images: imagesLocalUrls,
        voices: voiceLocalUrl,
        tag,
      });
      addMemoInQueries(temporaryMemo);
      addMemoInTagQueries(tag, temporaryMemo);

      const imageUrls = await getFileUrls(images);
      const voiceUrls = await getFileUrls(voice ? [voice] : []);

      temporaryMemo.image_urls = imageUrls;
      temporaryMemo.voice_urls = voiceUrls;
      updateMemoInQueries(temporaryMemo.id, temporaryMemo);
      updateMemoInTagQueries(tag, temporaryMemo.id, temporaryMemo);

      const response = await Api.createLinkedMemo(
        tag,
        message,
        imageUrls,
        voiceUrls
      );

      if (Api.isCreateMemoResponse(response)) {
        queryClient.invalidateQueries({ queryKey: ['recentMemo'] });
        console.log(
          queryClient.getQueriesData({ queryKey: ['childTagMemos', tag.id] })
        );
        queryClient.invalidateQueries({ queryKey: ['childTagMemos', tag.id] });
        console.log(68);
      } else {
        console.log(70);
        deleteMemoInQueries(temporaryMemo.id);
      }
    } catch (error) {}
  };

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

      const response = await Api.createMemo(message, imageUrls, voiceUrls);

      if (Api.isCreateMemoResponse(response)) {
        // FIXME: 이 때 배치가 완료 된 건 아니어서 일단 놔둠. sse 적용하면 해당 내용으로 수정
        updateMemoInQueries(temporaryMemo.id, response as Interface.Memo);
      } else {
        deleteMemoInQueries(temporaryMemo.id);
      }
    } catch (error) {}
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
  const createTemporaryMemo = async ({
    message,
    images,
    voices,
    tag,
  }: {
    message: string;
    images?: string[];
    voices?: string[];
    tag?: Interface.Tag;
  }) => {
    const optimisticMemo: Interface.Memo = {
      id: uuid_v4(),
      content: message,
      image_urls: images || [],
      voice_urls: voices || [],
      metadata: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: tag ? [tag] : [],
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

  const addMemoInTagQueries = (tag: Interface.Tag, memo: Interface.Memo) => {
    queryClient.setQueriesData<unknown>(
      { queryKey: ['childTagMemos', tag.id] },
      (oldData: any) => {
        return {
          pages: oldData?.pages.map((page: any) => ({
            ...page,
            memos: [memo, ...page?.memos],
          })),
          pageParams: oldData?.pageParams as any,
        };
      }
    );
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

  const updateMemoInTagQueries = (
    tag: Interface.Tag,
    optimisticMemoId: string,
    updateMemo: Interface.Memo
  ) => {
    queryClient.setQueriesData<unknown>(
      { queryKey: ['childTagMemos', tag.id] },
      (oldData: any) => {
        return {
          pages: oldData?.pages.map((page: any) => ({
            ...page,
            memos: page?.memos.map((memo: any) =>
              memo.id === optimisticMemoId ? updateMemo : memo
            ),
          })),
          pageParams: oldData?.pageParams as any,
        };
      }
    );
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
    handleCreateMemo,
    handleCreateLinkedMemo,
  };
};

export default useCreateMemoManager;
