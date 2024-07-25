import { useState, useEffect } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  getAllMemos,
  getSelectedTagMemos,
  isGetMemosResponse,
} from 'utils/auth';
import { Memo, Tag } from '../../@interfaces';

const useSelectedTagMemosManager = (selectedTag: Tag | null) => {
  const { data: allMemos = [] } = useQuery({
    queryKey: ['memos', 'ALL_MEMOS'],
    queryFn: getAllMemos,
    select: (data) => (isGetMemosResponse(data) ? data.memos : []),
    enabled: selectedTag == null,
  });
  const { data: selectedMemosByTag = [] }: UseQueryResult<Memo[], Error> =
    useQuery({
      queryKey: ['memos', 'SELECTED_MEMOS', selectedTag],
      queryFn: () => getSelectedTagMemos(selectedTag ? selectedTag.id : ''),
      select: (data): Memo[] => {
        if (isGetMemosResponse(data)) {
          return data.memos;
        } else {
          return [];
        }
      },
      enabled: !!selectedTag,
    });

  // 화면에 보이는
  const [viewMemos, setViewMemos] = useState<Memo[]>(
    selectedTag ? selectedMemosByTag : allMemos
  );

  useEffect(() => {
    setViewMemos(selectedTag ? selectedMemosByTag : allMemos);
  }, [selectedTag, selectedMemosByTag, allMemos]);

  // 서버 요청시, 낙관적 업데이트를 위한 코드
  const updateViewMemo = (newMemo: Memo) => {
    setViewMemos((prev) =>
      prev.map((memo) => (memo.id === newMemo.id ? newMemo : memo))
    );
  };

  const deleteViewMemo = (memoId: string) => {
    setViewMemos((prev) => prev.filter((memo) => memo.id !== memoId));
  };

  const revertViewMemo = (index: number, memo: Memo) => {
    setViewMemos((prev) => {
      const newMemos = [...prev];
      newMemos.splice(index, 0, memo);
      return newMemos;
    });
  };

  return {
    viewMemos,
    updateViewMemo,
    deleteViewMemo,
    revertViewMemo,
  };
};

export default useSelectedTagMemosManager;
