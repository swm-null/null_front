import { useQueryClient } from '@tanstack/react-query';
import {
  deleteMemo,
  isUpdateMemoResponse,
  isValidResponse,
  paginationMemos,
  updateMemo,
} from 'api';
import { useTranslation } from 'react-i18next';
import { Memo, Tag } from 'pages/home/subPages/interfaces';

interface InfiniteQueryData {
  pages: paginationMemos[];
  pageParams: number[];
}

const useMemoManager = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const allQueriesData = queryClient.getQueriesData<paginationMemos>({
    queryKey: ['childTagMemos'],
    exact: false,
  });

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
    newImageUrls: string[] | null;
    handlePreProcess: () => void;
  }) => {
    handlePreProcess();

    const newMemo = {
      id: memo.id,
      content: newMessage,
      tags: newTags,
      image_urls: newImageUrls,
      created_at: memo.created_at,
      updated_at: memo.updated_at,
    };

    if (memo.content !== newMemo.content) {
      const oldDataMap = new Map();

      allQueriesData.forEach((query) => {
        const queryKey = query[0];
        const queryMemos = query[1];

        if (queryMemos) {
          oldDataMap.set(queryKey, queryMemos);

          queryClient.setQueryData(queryKey, (oldData: InfiniteQueryData) => {
            const updatedPages = oldData.pages.map((page: paginationMemos) => {
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
        }
      });

      const response = await updateMemo(
        newMemo.id,
        newMemo.content,
        newMemo.image_urls
      );

      if (!isUpdateMemoResponse(response)) {
        alert(t('pages.memo.updateErrorMessage'));

        oldDataMap.forEach((oldData, queryKey) => {
          queryClient.setQueryData(queryKey, oldData);
        });
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
    handlePreProcess && handlePreProcess();

    const oldDataMap = new Map();

    allQueriesData.forEach((query) => {
      const queryKey = query[0];
      const queryMemos = query[1];

      if (queryMemos) {
        oldDataMap.set(queryKey, queryMemos);

        queryClient.setQueryData(queryKey, (oldData: InfiniteQueryData) => {
          const updatedPages = oldData.pages.map((page: paginationMemos) => {
            const newMemos = page.memos.filter((m) => m.id !== memo.id);
            return { ...page, memos: newMemos };
          });

          return { ...oldData, pages: updatedPages };
        });
      }
    });

    const response = await deleteMemo(memo.id);
    if (!isValidResponse(response)) {
      alert(t('pages.memo.deleteErrorMessage'));

      oldDataMap.forEach((oldData, queryKey) => {
        queryClient.setQueryData(queryKey, oldData);
      });
    }
  };

  return { handleUpdateMemo, handleDeleteMemo };
};

export default useMemoManager;
