import { useQueryClient } from '@tanstack/react-query';
import { InfiniteQueryData, MemoData } from './interfaces';
import { deleteMemo, isValidResponse } from 'api';
import { useTranslation } from 'react-i18next';
import { Memo } from 'pages/home/subPages/interfaces';

const useMemoDeleteManager = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const allQueriesData = queryClient.getQueriesData<MemoData>({
    queryKey: ['childTagMemos'],
    exact: false,
  });

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
          const updatedPages = oldData.pages.map((page: MemoData) => {
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

  return { handleDeleteMemo };
};

export default useMemoDeleteManager;
