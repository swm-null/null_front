import { useEffect, useState } from 'react';
import { getAllMemos, isGetAllMemosResponse } from 'utils/auth';
import { useQuery } from '@tanstack/react-query';

const useSelectedTagMemosManager = () => {
  // 선택한 태그
  // selectedTag가 null일 때에는, 모든 태그가 선택된 경우
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 메모 전체
  const { data: allMemos = [], refetch } = useQuery({
    queryKey: ['memos', 'ALL_MEMOS'],
    queryFn: getAllMemos,
    select: (data) => (isGetAllMemosResponse(data) ? data.memos : []),
  });
  // 특정 태그의 메모
  // TODO: Tag를 이용하여 메모를 가져오는 api 만들면, react-query 사용하도록 수정
  const selectedMemosByTag = allMemos.filter((item) =>
    item.tags.some((tag) => tag.name === selectedTag)
  );
  // 화면에 보여지는 메모
  const viewMemos = selectedTag ? selectedMemosByTag : allMemos;

  // 모든 태그
  const tags = [...new Set(allMemos.flatMap((memo) => memo.tags))].sort();

  const handleTagClick = (tag: string | null) => {
    if (tag !== selectedTag) {
      setSelectedTag(tag);
    }
  };

  const clickAllTags = () => {
    handleTagClick(null);
  };

  useEffect(() => {
    const handleFocus = () => {
      // 윈도우 포커스 시 refetch 호출
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
  };
};

export default useSelectedTagMemosManager;
