import { useContext, useMemo } from 'react';
import { QueryKey, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AlertContext } from 'utils';
import { Memo } from 'pages/home/subPages/interfaces';
import { errorResponse } from 'pages/api/interface';
import { cuMemoResponse } from '../interface';
import { isUpdateMemoResponse, updateMemo, updateMemoWithNewTags } from './api';
import { paginationMemos } from 'pages/home/subPages/api';
import { isFilesResponse, uploadFile, uploadFiles } from 'pages/home/api';

interface InfiniteQueryData {
  pages: paginationMemos[];
  pageParams: number[];
}

const RECENT_MEMO_QUERY_KEY = ['recentMemo'];

const useUpdateMemoManager = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { alert } = useContext(AlertContext);

  const childTagMemosQueriesData = queryClient.getQueriesData<paginationMemos>({
    queryKey: ['childTagMemos'],
    exact: false,
  });

  const recentMemoQueryData =
    queryClient.getQueryData<paginationMemos>(RECENT_MEMO_QUERY_KEY);

  const allMemosQueriesData = useMemo(() => {
    const recentMemoQuery: [QueryKey, paginationMemos | undefined] = [
      RECENT_MEMO_QUERY_KEY,
      recentMemoQueryData,
    ];

    return [...childTagMemosQueriesData, recentMemoQuery];
  }, [childTagMemosQueriesData, recentMemoQueryData]);

  const backupMemoData = () => {
    const backupData = new Map();
    allMemosQueriesData.forEach(([queryKey, queryData]) => {
      if (queryData) {
        backupData.set(queryKey, queryData);
      }
    });
    return backupData;
  };

  const restoreMemoData = (backupData: Map<QueryKey, InfiniteQueryData>) => {
    backupData.forEach((data, queryKey) => {
      queryClient.setQueryData(queryKey, data);
    });
  };

  const getFileUrls = async (files: File[]): Promise<string[]> => {
    if (!files.length) return [];
    const response =
      files.length === 1 ? await uploadFile(files[0]) : await uploadFiles(files);
    if (!isFilesResponse(response)) {
      throw new Error(t('file.uploadError'));
    }
    return response.urls;
  };

  const handleUpdateMemo = async ({
    memo,
    tagRebuild,
    newContent,
    newImages,
    newVoice,
    oldImageUrls,
    oldVoiceUrls,
    localImageUrls,
  }: {
    memo: Memo;
    tagRebuild: boolean;
    newContent: string;
    newImages: File[];
    newVoice: File | null;
    oldImageUrls: string[];
    oldVoiceUrls: string[];
    localImageUrls: string[];
  }) => {
    try {
      const newMemo = {
        ...memo,
        content: newContent,
        image_urls: [...oldImageUrls, ...localImageUrls],
        voice_urls: oldVoiceUrls,
      };

      updateMemoDataInQueries(newMemo);

      const newImageS3Urls = await getFileUrls(newImages);
      const newVoiceS3Urls = await getFileUrls(newVoice ? [newVoice] : []);

      const updatedMemo = { ...newMemo };
      updatedMemo.image_urls = [...oldImageUrls, ...newImageS3Urls];
      updatedMemo.voice_urls = newVoiceS3Urls.length ? newVoiceS3Urls : oldVoiceUrls;

      updateMemoDataInQueries(updatedMemo);

      const backupData = backupMemoData();

      const updateApiCall = tagRebuild
        ? () =>
            updateMemoWithNewTags(
              updatedMemo.id,
              updatedMemo.content,
              updatedMemo.image_urls,
              updatedMemo.voice_urls
            )
        : () =>
            updateMemo(
              updatedMemo.id,
              updatedMemo.content,
              updatedMemo.image_urls,
              updatedMemo.voice_urls
            );

      await handleUpdateMemoData(memo, backupData, updateApiCall);
    } catch (error) {
      alert(t('memo.updateErrorMessage'));
    }
  };

  const handleUpdateMemoData = async (
    memo: Memo,
    backupData: Map<QueryKey, InfiniteQueryData>,
    updateApiCall: () => Promise<cuMemoResponse | errorResponse>
  ) => {
    const response = await updateApiCall();
    if (isUpdateMemoResponse(response)) {
      const updatedMemo = response as Memo;
      updateTagsInQuery(memo, updatedMemo);
    } else {
      alert(t('memo.updateErrorMessage'));
      restoreMemoData(backupData);
    }
  };

  const updateMemoDataInQueries = (newMemo: Memo) => {
    allMemosQueriesData.forEach(([queryKey]) => {
      queryClient.setQueryData(queryKey, (oldData: InfiniteQueryData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            if (!page) return page;

            const memoIndex = page.memos.findIndex((m) => m.id === newMemo.id);
            if (memoIndex !== -1) {
              const updatedMemos = [...page.memos];
              updatedMemos.splice(memoIndex, 1);
              return { ...page, memos: [newMemo, ...updatedMemos] };
            }
            return page;
          }),
        };
      });
    });
  };

  const updateTagsInQuery = (memo: Memo, newMemo: Memo) => {
    if (JSON.stringify(memo.tags) === JSON.stringify(newMemo.tags)) return;

    memo.tags.forEach((tag) => {
      queryClient.setQueryData(
        ['childTagMemos', tag.id],
        (oldData: InfiniteQueryData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              memos: page.memos.filter((m) => m.id !== memo.id),
            })),
          };
        }
      );
    });

    newMemo.tags.forEach((tag) => {
      queryClient.setQueryData(
        ['childTagMemos', tag.id],
        (oldData: InfiniteQueryData) => {
          if (!oldData) return oldData;

          const firstPage = oldData.pages[0];
          const updatedFirstPage = {
            ...firstPage,
            memos: [newMemo, ...firstPage.memos],
          };
          return {
            ...oldData,
            pages: [updatedFirstPage, ...oldData.pages.slice(1)],
          };
        }
      );
    });
  };

  return {
    handleUpdateMemo,
  };
};

export default useUpdateMemoManager;
