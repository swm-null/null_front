import { QueryKey, useQueryClient } from '@tanstack/react-query';
import * as Api from 'api';
import { useTranslation } from 'react-i18next';
import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { useContext, useMemo } from 'react';
import { AlertContext } from 'utils';

interface InfiniteQueryData {
  pages: Api.paginationMemos[];
  pageParams: number[];
}

const RECENT_MEMO_QUERY_KEY = ['recentMemo'];

const useMemoManager = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { alert, confirmAlert } = useContext(AlertContext);

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
    allMemosQueriesData.forEach((query) => {
      const queryKey = query[0];
      const queryData = query[1];
      if (queryData) {
        backupData.set(queryKey, queryData);
      }
    });
    return backupData;
  };

  const restoreMemoData = (backupData: Map<string[], InfiniteQueryData>) => {
    backupData.forEach((data, queryKey) => {
      queryClient.setQueryData(queryKey, data);
    });
  };

  const handleUpdateMemo = async ({
    memo,
    newMessage,
    newTags,
    newImageUrls,
    newVoiceUrls,
    handlePreProcess,
  }: {
    memo: Memo;
    newMessage: string;
    newTags: Tag[];
    newImageUrls: string[];
    newVoiceUrls: string[];
    handlePreProcess: () => void;
  }) => {
    handlePreProcess();

    const newMemo = {
      ...memo,
      content: newMessage,
      tags: newTags,
      image_urls: newImageUrls,
      voice_urls: newVoiceUrls,
    };

    const isContentChanged = memo.content !== newMemo.content;
    const isTagsChanged = JSON.stringify(memo.tags) !== JSON.stringify(newMemo.tags);
    const isImagesChanged =
      JSON.stringify(memo.image_urls) !== JSON.stringify(newMemo.image_urls);
    const isVoicesChange =
      JSON.stringify(memo.voice_urls) !== JSON.stringify(newMemo.voice_urls);

    if (isContentChanged || isTagsChanged || isImagesChanged || isVoicesChange) {
      const backupData = backupMemoData();
      updateMemoDataInQueries(newMemo);

      const response = await Api.updateMemo(
        newMemo.id,
        newMemo.content,
        newMemo.image_urls,
        newMemo.voice_urls
      );
      if (!Api.isUpdateMemoResponse(response)) {
        alert(t('memo.updateErrorMessage'));
        restoreMemoData(backupData);
      }
    }
  };

  const updateMemoDataInQueries = (newMemo: Memo) => {
    allMemosQueriesData.forEach((query) => {
      const queryKey = query[0];

      queryClient.setQueryData(queryKey, (oldData: InfiniteQueryData) => {
        if (!oldData) return oldData;

        const updatedPages = oldData.pages.map((page) => {
          if (!page) return page;

          const memoIndex = page.memos.findIndex((m) => m.id === newMemo.id);
          if (memoIndex !== -1) {
            const updatedMemos = [...page.memos];
            updatedMemos[memoIndex] = newMemo;
            return { ...page, memos: updatedMemos };
          }
          return page;
        });
        return { ...oldData, pages: updatedPages };
      });
    });
  };

  const handleUpdateMemoWithRecreateTags = async ({
    memo,
    newMessage,
    newTags,
    newImageUrls,
    newVoiceUrls,
    handlePreProcess,
  }: {
    memo: Memo;
    newMessage: string;
    newTags: Tag[];
    newImageUrls: string[];
    newVoiceUrls: string[];
    handlePreProcess: () => void;
  }) => {
    handlePreProcess();

    const newMemo = {
      ...memo,
      content: newMessage,
      tags: newTags,
      image_urls: newImageUrls,
      voice_urls: newVoiceUrls,
    };

    const isContentChanged = memo.content !== newMemo.content;
    const isTagsChanged = JSON.stringify(memo.tags) !== JSON.stringify(newMemo.tags);
    const isImagesChanged =
      JSON.stringify(memo.image_urls) !== JSON.stringify(newMemo.image_urls);
    const isVoicesChanged =
      JSON.stringify(memo.voice_urls) !== JSON.stringify(newMemo.voice_urls);

    if (isContentChanged || isTagsChanged || isImagesChanged || isVoicesChanged) {
      const backupData = backupMemoData();
      updateMemoDataInQueries(newMemo);

      const response = await Api.updateMemoWithNewTags(
        newMemo.id,
        newMemo.content,
        newMemo.image_urls,
        newMemo.voice_urls
      );

      if (Api.isUpdateMemoResponse(response)) {
        const newMemo = response as Memo;

        if (JSON.stringify(memo.tags) === JSON.stringify(newMemo.tags)) return;

        memo.tags.forEach((tag) => {
          queryClient.setQueryData(
            ['childTagMemos', tag.id],
            (oldData: InfiniteQueryData) => {
              if (!oldData) return oldData;
              const updatedPages = oldData.pages.map((page) => ({
                ...page,
                memos: page.memos.filter((m) => m.id !== memo.id),
              }));
              return { ...oldData, pages: updatedPages };
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
      } else {
        alert(t('memo.updateErrorMessage'));
        restoreMemoData(backupData);
      }
    }
  };

  const handleDeleteMemo = async ({
    memo,
    handlePreProcess,
  }: {
    memo: Memo;
    handlePreProcess?: () => void;
  }) => {
    const confirmed = await confirmAlert(t('memo.delete.alert'));
    if (!confirmed) return;

    handlePreProcess && handlePreProcess();

    const backupData = backupMemoData();
    deleteMemoDataInQueries(memo.id);

    const response = await Api.deleteMemo(memo.id);
    if (!Api.isValidResponse(response)) {
      alert(t('memo.deleteErrorMessage'));
      restoreMemoData(backupData);
    }
  };

  const deleteMemoDataInQueries = (memoId: string) => {
    allMemosQueriesData.forEach((query) => {
      const queryKey = query[0];
      queryClient.setQueryData(queryKey, (oldData: InfiniteQueryData) => {
        if (!oldData) return oldData;

        const updatedPages = oldData.pages.map((page) => {
          if (!page) return page;

          const newMemos = page.memos.filter((m) => m.id !== memoId);
          return { ...page, memos: newMemos };
        });
        return { ...oldData, pages: updatedPages };
      });
    });
  };

  return { handleUpdateMemo, handleUpdateMemoWithRecreateTags, handleDeleteMemo };
};

export default useMemoManager;
