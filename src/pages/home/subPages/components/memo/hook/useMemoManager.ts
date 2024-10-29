import { useQueryClient } from '@tanstack/react-query';
import * as Api from 'api';
import { useTranslation } from 'react-i18next';
import { Memo, Tag } from 'pages/home/subPages/interfaces';

interface InfiniteQueryData {
  pages: Api.paginationMemos[];
  pageParams: number[];
}

const useMemoManager = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const allMemosQueriesData = queryClient.getQueriesData<Api.paginationMemos>({
    queryKey: ['childTagMemos'],
    exact: false,
  });

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

  const restoreMemoData = (backupData: Map<any, any>) => {
    backupData.forEach((data, queryKey) => {
      queryClient.setQueryData(queryKey, data);
    });
  };

  const handleUpdateMemo = async ({
    memo,
    newMessage,
    newTags,
    newImageUrls,
    handlePreProcess,
  }: {
    memo: Memo;
    newMessage: string;
    newTags: Tag[];
    newImageUrls: string[];
    handlePreProcess: () => void;
  }) => {
    handlePreProcess();

    const newMemo = {
      ...memo,
      content: newMessage,
      tags: newTags,
      image_urls: newImageUrls,
    };

    const isContentChanged = memo.content !== newMemo.content;
    const isTagsChanged = JSON.stringify(memo.tags) !== JSON.stringify(newMemo.tags);
    const isImagesChanged =
      JSON.stringify(memo.image_urls) !== JSON.stringify(newMemo.image_urls);

    if (isContentChanged || isTagsChanged || isImagesChanged) {
      const backupData = backupMemoData();
      updateMemoDataInQueries(newMemo);

      const response = await Api.updateMemo(
        newMemo.id,
        newMemo.content,
        newMemo.image_urls
      );
      if (!Api.isUpdateMemoResponse(response)) {
        alert(t('pages.memo.updateErrorMessage'));
        restoreMemoData(backupData);
      }
    }
  };

  const updateMemoDataInQueries = (newMemo: Memo) => {
    allMemosQueriesData.forEach((query) => {
      const queryKey = query[0];
      queryClient.setQueryData(queryKey, (oldData: InfiniteQueryData) => {
        const updatedPages = oldData.pages.map((page) => {
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

  const handleDeleteMemo = async ({
    memo,
    handlePreProcess,
  }: {
    memo: Memo;
    handlePreProcess?: () => void;
  }) => {
    handlePreProcess && handlePreProcess();

    const backupData = backupMemoData();
    deleteMemoDataInQueries(memo.id);

    const response = await Api.deleteMemo(memo.id);
    if (!Api.isValidResponse(response)) {
      alert(t('pages.memo.deleteErrorMessage'));
      restoreMemoData(backupData);
    }
  };

  const deleteMemoDataInQueries = (memoId: string) => {
    allMemosQueriesData.forEach((query) => {
      const queryKey = query[0];
      queryClient.setQueryData(queryKey, (oldData: InfiniteQueryData) => {
        const updatedPages = oldData.pages.map((page) => {
          const newMemos = page.memos.filter((m) => m.id !== memoId);
          return { ...page, memos: newMemos };
        });
        return { ...oldData, pages: updatedPages };
      });
    });
  };

  return { handleUpdateMemo, handleDeleteMemo };
};

export default useMemoManager;
