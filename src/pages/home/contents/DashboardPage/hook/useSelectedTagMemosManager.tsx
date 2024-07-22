import { useState } from 'react';
import {
  getAllMemos,
  getSelectedTagMemos,
  isGetMemosResponse,
} from 'utils/auth';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Memo, Tag } from '../../@interfaces';

const useSelectedTagMemosManager = () => {
  // 선택한 태그
  // selectedTag가 null일 때에는, 모든 태그가 선택된 경우
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  // 메모 전체
  const { data: allMemos = [] } = useQuery({
    queryKey: ['memos', 'ALL_MEMOS'],
    queryFn: getAllMemos,
    select: (data) => (isGetMemosResponse(data) ? data.memos : []),
    enabled: selectedTag == null,
  });
  const { data: selectedMemosByTag = [] }: UseQueryResult<Memo[], Error> =
    useQuery({
      queryKey: ['memos', 'SELECTED_MEMOS', selectedTag],
      queryFn: () =>
        getSelectedTagMemos(selectedTag !== null ? selectedTag.id : ''),
      select: (data): Memo[] => {
        if (isGetMemosResponse(data)) {
          return data.memos;
        } else {
          return [];
        }
      },
      enabled: !!selectedTag, // selectedTag가 있을 때만 쿼리를 실행
    });
  // 화면에 보여지는 메모
  const viewMemos = selectedTag ? selectedMemosByTag : allMemos;

  const tags = Array.from(
    new Map(
      viewMemos.flatMap((memo) => memo.tags.map((tag) => [tag.id, tag]))
    ).values()
  ).sort((tag1, tag2) => tag1.name.localeCompare(tag2.name));

  const handleTagClick = (tag: Tag | null) => {
    if (tag !== selectedTag) {
      setSelectedTag(tag);
    }
  };

  const clickAllTags = () => {
    handleTagClick(null);
  };

  return {
    viewMemos,
    tags,
    selectedTag,
    handleTagClick,
    clickAllTags,
  };
};

export default useSelectedTagMemosManager;
