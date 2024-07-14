import { useState } from 'react';
import { getAllMemos, isGetAllMemosResponse } from 'utils/auth';
import { useQuery } from '@tanstack/react-query';

const useOriginalMemoManager = () => {
  const { data: originalMemosAll = [] } = useQuery({
    queryKey: ['memos', 'all'],
    queryFn: getAllMemos,
    select: (data) => (isGetAllMemosResponse(data) ? data.memos : []),
  });

  // TODO: Tag를 이용하여 메모를 가져오는 api 만들면, react-query 사용하도록 수정
  const originalMemosByTag = originalMemosAll.filter((item) =>
    item.tags.includes(selectedTag)
  );

  const [selectedTag, setSelectedTag] = useState<'all' | string>('all');
  const viewMemos =
    selectedTag !== 'all' ? originalMemosByTag : originalMemosAll;

  const tags = [
    ...new Set(originalMemosAll.flatMap((memo) => memo.tags)),
  ].sort();

  const handleTagClick = (tag: string) => {
    if (tag !== selectedTag) {
      setSelectedTag(tag);
    }
  };

  return {
    viewMemos,
    tags,
    handleTagClick,
  };
};

export default useOriginalMemoManager;
