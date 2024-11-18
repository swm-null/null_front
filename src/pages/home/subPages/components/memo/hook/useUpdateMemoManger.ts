import { QueryKey, useQueryClient } from '@tanstack/react-query';
import * as Api from 'api';
import { useTranslation } from 'react-i18next';
import { Memo } from 'pages/home/subPages/interfaces';
import { useContext, useMemo } from 'react';
import { AlertContext } from 'utils';
import { errorResponse } from 'api/interface';

interface InfiniteQueryData {
  pages: Api.paginationMemos[];
  pageParams: number[];
}

const RECENT_MEMO_QUERY_KEY = ['recentMemo'];

const useUpdateMemoManager = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { alert } = useContext(AlertContext);

  const childTagMemosQueriesData = queryClient.getQueriesData<Api.paginationMemos>({
    queryKey: ['childTagMemos'],
    exact: false,
  });

  const recentMemoQueryData =
    queryClient.getQueryData<Api.paginationMemos>(RECENT_MEMO_QUERY_KEY);

  const allMemosQueriesData = useMemo(() => {
    const recentMemoQuery: [QueryKey, Api.paginationMemos | undefined] = [
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
      files.length === 1
        ? await Api.uploadFile(files[0])
        : await Api.uploadFiles(files);
    if (!Api.isFilesResponse(response)) {
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
  }: {
    memo: Memo;
    tagRebuild: boolean;
    newContent: string;
    newImages: File[];
    newVoice: File | null;
    oldImageUrls: string[];
    oldVoiceUrls: string[];
  }) => {
    try {
      const newImageUrls = await getFileUrls(newImages);
      const newVoiceUrls = await getFileUrls(newVoice ? [newVoice] : []);

      const newMemo = {
        ...memo,
        content: newContent,
        image_urls: [...oldImageUrls, ...newImageUrls],
        voice_urls: newVoiceUrls.length ? newVoiceUrls : oldVoiceUrls,
      };

      const backupData = backupMemoData();

      const updateApiCall = tagRebuild
        ? () =>
            Api.updateMemoWithNewTags(
              newMemo.id,
              newMemo.content,
              newMemo.image_urls,
              newMemo.voice_urls
            )
        : () =>
            Api.updateMemo(
              newMemo.id,
              newMemo.content,
              newMemo.image_urls,
              newMemo.voice_urls
            );

      await handleUpdateMemoData(memo, newMemo, backupData, updateApiCall);
    } catch (error) {
      alert(t('memo.updateErrorMessage'));
    }
  };

  const handleUpdateMemoData = async (
    memo: Memo,
    newMemo: Memo,
    backupData: Map<QueryKey, InfiniteQueryData>,
    updateApiCall: () => Promise<Api.cuMemoResponse | errorResponse>
  ) => {
    updateMemoDataInQueries(newMemo);

    const response = await updateApiCall();
    if (Api.isUpdateMemoResponse(response)) {
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
              updatedMemos[memoIndex] = newMemo;
              return { ...page, memos: updatedMemos };
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
