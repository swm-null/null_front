import { useEffect, useState } from 'react';
import { getAllMemos, isGetAllMemosResponse } from 'utils/auth';
import { useQuery } from '@tanstack/react-query';
import { Memo } from '../../@interfaces';

const useSelectedTagMemosManager = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: allMemos = [], refetch } = useQuery({
    queryKey: ['memos', 'ALL_MEMOS'],
    queryFn: getAllMemos,
    select: (data) => (isGetAllMemosResponse(data) ? data.memos : []),
  });

  const selectedMemosByTag = allMemos.filter((item) =>
    item.tags.some((tag) => tag.name === selectedTag)
  );

  const [viewMemos, setViewMemos] = useState(
    selectedTag ? selectedMemosByTag : allMemos
  );

  // tag가 변경될 때마다 viewMemos 수정
  useEffect(() => {
    setViewMemos(selectedTag ? selectedMemosByTag : allMemos);
  }, [selectedTag, allMemos]);

  const tags = Array.from(
    new Map(
      allMemos.flatMap((memo) => memo.tags.map((tag) => [tag.id, tag]))
    ).values()
  ).sort((tag1, tag2) => tag1.name.localeCompare(tag2.name));

  const handleTagClick = (tag: string | null) => {
    if (tag !== selectedTag) {
      setSelectedTag(tag);
    }
  };

  const clickAllTags = () => {
    handleTagClick(null);
  };

  const updateViewMemo = (newMemo: Memo) => {
    setViewMemos((prev) =>
      prev.map((memo) => (memo.id === newMemo.id ? newMemo : memo))
    );
  };

  const deleteViewMemo = (memoId: string) => {
    setViewMemos((prev) => prev.filter((memo, _) => memo.id !== memoId));
  };

  const revertViewMemo = (index: number, memo: Memo) => {
    setViewMemos((prev) => {
      const newMemos = [...prev];
      newMemos.splice(index, 0, memo);
      return newMemos;
    });
  };

  useEffect(() => {
    const handleFocus = () => {
      refetch();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refetch]);

  return {
    viewMemos,
    tags,
    handleTagClick,
    clickAllTags,
    updateViewMemo,
    deleteViewMemo,
    revertViewMemo,
  };
};

export default useSelectedTagMemosManager;
