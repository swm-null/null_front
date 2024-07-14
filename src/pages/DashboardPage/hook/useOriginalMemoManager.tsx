import { useState } from 'react';
import { Memo } from 'interfaces/MemoInterface';

const useOriginalMemoManager = ({ dummyData = [] }: {
  dummyData?: Memo[]
}) => {
  const [originalMemos, setOriginalMemos] = useState<Memo[]>(dummyData || []);
  const [selectedTag, setSelectedTag] = useState<'all'|string>('all');
  const viewMemos = selectedTag !== 'all'
    ? originalMemos.filter((item) => item.tags.includes(selectedTag))
    : originalMemos;

  const tags = [...new Set(originalMemos.flatMap((memo, index) => memo.tags))].sort();

  const updateOriginalMemo = (index: number, newMemo: Memo) => {
    setOriginalMemos((prev) => prev.map((memo, i) => (i === index ? newMemo : memo)));
  };

  const deleteOriginalMemo = (index: number) => {
    setOriginalMemos((prev) => prev.filter((memo, i) => i !== index));
  };

  const handleTagClick = (tag: string) => {
    if (tag !== selectedTag) {
      setSelectedTag(tag);
    }
  }

  return {
    viewMemos,
    tags,
    updateOriginalMemo,
    deleteOriginalMemo,
    handleTagClick
  };
};

export default useOriginalMemoManager;
