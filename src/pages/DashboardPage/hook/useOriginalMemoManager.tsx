import { useEffect, useState } from 'react';
import { Memo } from 'interfaces/MemoInterface';
import { getAllMemos, isGetAllMemosResponse } from 'utils/auth';

const useOriginalMemoManager = ({ dummyData = [] }: { dummyData?: Memo[] }) => {
  const [originalMemos, setOriginalMemos] = useState<Memo[]>([]);
  const [selectedTag, setSelectedTag] = useState<'all' | string>('all');
  const viewMemos =
    selectedTag !== 'all'
      ? originalMemos.filter((item) => item.tags.includes(selectedTag))
      : originalMemos;

  const tags = [...new Set(originalMemos.flatMap((memo) => memo.tags))].sort();

  const updateOriginalMemo = (index: number, newMemo: Memo) => {
    setOriginalMemos((prev) =>
      prev.map((memo, i) => (i === index ? newMemo : memo))
    );
  };

  const deleteOriginalMemo = (index: number) => {
    setOriginalMemos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTagClick = (tag: string) => {
    if (tag !== selectedTag) {
      setSelectedTag(tag);
    }
  };

  // FIXME: 현재는 react-query 안 쓰고 대충 서버와 연동만 함. 나중에 추가.
  const setAllMemos = async () => {
    const response = await getAllMemos();
    if (!isGetAllMemosResponse(response)) {
      setOriginalMemos(dummyData);
      return;
    }

    setOriginalMemos(response.memos);
  };

  useEffect(() => {
    setAllMemos();
  }, []);

  return {
    viewMemos,
    tags,
    updateOriginalMemo,
    deleteOriginalMemo,
    handleTagClick,
  };
};

export default useOriginalMemoManager;
