import { v4 as uuid_v4 } from 'uuid';
import { useQueryClient } from '@tanstack/react-query';
import { isFilesResponse, uploadFile, uploadFiles } from 'pages/home/api';
import { createLinkedMemo, createMemo, isCreateMemoResponse } from './api';
import { Memo, Tag } from 'pages/home/subPages/interfaces';

const useCreateMemoManager = () => {
  const queryClient = useQueryClient();

  const handleCreateLinkedMemo = async (
    tag: Tag,
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

      const response = await createLinkedMemo(tag, message, imageUrls, voiceUrls);

      if (!isCreateMemoResponse(response)) {
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

      const response = await createMemo(message, imageUrls, voiceUrls);

      if (isCreateMemoResponse(response)) {
        // FIXME: 이 때 배치가 완료 된 건 아니어서 일단 놔둠. sse 적용하면 해당 내용으로 수정
        updateMemoInQueries(temporaryMemo.id, response as Memo);
      } else {
        deleteMemoInQueries(temporaryMemo.id);
      }
    } catch (error) {}
  };

  const getFileUrls = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    const response =
      files.length === 1 ? await uploadFile(files[0]) : await uploadFiles(files);
    if (!isFilesResponse(response))
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
    tag?: Tag;
  }) => {
    const optimisticMemo: Memo = {
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

  const addMemoInQueries = (memo: Memo) => {
    queryClient.setQueryData<unknown>(['recentMemo'], (oldData: any) => {
      if (!oldData) return oldData;

      const updatedPages = [...oldData.pages];
      updatedPages[0].currentCount = updatedPages[0].currentCount + 1;
      updatedPages[0].memos = [memo, ...updatedPages[0].memos];

      return {
        pages: updatedPages,
        pageParams: oldData?.pageParams as any,
      };
    });
  };

  const addMemoInTagQueries = (tag: Tag, memo: Memo) => {
    queryClient.setQueriesData<unknown>(
      { queryKey: ['childTagMemos', tag.id] },
      (oldData: any) => {
        if (!oldData) return oldData;

        const updatedPages = [...oldData.pages];
        updatedPages[0].currentCount = updatedPages[0].currentCount + 1;
        updatedPages[0].memos = [memo, ...updatedPages[0].memos];

        return {
          pages: updatedPages,
          pageParams: oldData?.pageParams as any,
        };
      }
    );
  };

  const updateMemoInQueries = (optimisticMemoId: string, updateMemo: Memo) => {
    queryClient.setQueryData<unknown>(['recentMemo'], (oldData: any) => {
      if (!oldData) return oldData;

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
    tag: Tag,
    optimisticMemoId: string,
    updateMemo: Memo
  ) => {
    queryClient.setQueriesData<unknown>(
      { queryKey: ['childTagMemos', tag.id] },
      (oldData: any) => {
        if (!oldData) return null;

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
    queryClient.setQueryData<unknown>(['recentMemo'], (oldData: any) => {
      if (!oldData) return oldData;

      return {
        pages: oldData?.pages.map((page: any) => ({
          ...page,
          currentCount: page?.currentCount - 1,
          memos:
            page?.memos.filter((memo: Memo) => memo.id !== optimisticMemoId) || [],
        })),
        pageParams: oldData?.pageParams as any,
      };
    });
  };

  return {
    handleCreateMemo,
    handleCreateLinkedMemo,
  };
};

export default useCreateMemoManager;
