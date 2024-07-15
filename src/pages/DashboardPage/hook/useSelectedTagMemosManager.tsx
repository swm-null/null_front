import { useState } from 'react';
import { getAllMemos, isGetAllMemosResponse } from 'utils/auth';
import { useQuery } from '@tanstack/react-query';

const useSelectedTagMemosManager = () => {
  // 선택한 태그
  const [selectedTag, setSelectedTag] = useState<'all' | string>('all');

  // 메모 전체
  const { data: allMemos = [] } = useQuery({
    queryKey: ['memos', 'all'],
    queryFn: getAllMemos,
    select: (data) => (isGetAllMemosResponse(data) ? data.memos : []),
  });
  // 특정 태그의 메모
  // TODO: Tag를 이용하여 메모를 가져오는 api 만들면, react-query 사용하도록 수정
  const selectedMemosByTag = allMemos.filter((item) =>
    item.tags.includes(selectedTag)
  );
  // 화면에 보여지는 메모
  const viewMemos = selectedTag !== 'all' ? selectedMemosByTag : allMemos;

  // 모든 태그
  const tags = [...new Set(allMemos.flatMap((memo) => memo.tags))].sort();

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

export default useSelectedTagMemosManager;
