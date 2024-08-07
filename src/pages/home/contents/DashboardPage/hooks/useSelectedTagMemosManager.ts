import { useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAllMemos,
  getSelectedTagMemos,
  isGetMemosResponse,
} from 'utils/auth';
import { Memo, Tag } from '../../_interfaces';

const useSelectedTagMemosManager = (selectedTag: Tag | null) => {
  const queryClient = useQueryClient();

  const { data: viewMemos = [], refetch } = useQuery({
    queryKey: ['memos', selectedTag ? selectedTag.id : 'ALL_MEMOS'],
    queryFn: () =>
      selectedTag ? fetchSelectedTagMemos(selectedTag.id) : fetchAllMemos(),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const fetchSelectedTagMemos = async (tagId: string) => {
    const response = await getSelectedTagMemos(tagId);
    if (isGetMemosResponse(response)) {
      return response.memos;
    } else {
      return [];
    }
  };

  const fetchAllMemos = async () => {
    const response = await getAllMemos();
    if (isGetMemosResponse(response)) {
      return response.memos;
    } else {
      return [];
    }
  };

  const updateViewMemo = useCallback(
    (newMemo: Memo) => {
      queryClient.setQueryData(
        ['memos', selectedTag ? selectedTag.id : 'ALL_MEMOS'],
        (prev: Memo[] = []) =>
          prev.map((memo) => (memo.id === newMemo.id ? newMemo : memo))
      );
    },
    [queryClient, selectedTag]
  );

  const deleteViewMemo = useCallback(
    (memoId: string) => {
      queryClient.setQueryData(
        ['memos', selectedTag ? selectedTag.id : 'ALL_MEMOS'],
        (prev: Memo[] = []) => prev.filter((memo) => memo.id !== memoId)
      );
    },
    [queryClient, selectedTag]
  );

  const revertViewMemo = useCallback(
    (index: number, memo: Memo) => {
      queryClient.setQueryData(
        ['memos', selectedTag ? selectedTag.id : 'ALL_MEMOS'],
        (prev: Memo[] = []) => {
          const newMemos = [...prev];
          newMemos.splice(index, 0, memo);
          return newMemos;
        }
      );
    },
    [queryClient, selectedTag]
  );

  useEffect(() => {
    refetch();
  }, [selectedTag, refetch]);

  return {
    viewMemos,
    updateViewMemo,
    deleteViewMemo,
    revertViewMemo,
  };
};

export default useSelectedTagMemosManager;
