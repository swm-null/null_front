import { useState, useEffect } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  getAllMemos,
  getSelectedTagMemos,
  getAllTags, // 서버에서 태그들을 요청하는 함수
  isGetMemosResponse,
  isGetTagsResponse,
  getChildTags, // 태그 응답을 확인하는 함수
} from 'utils/auth';
import { Memo, Tag } from '../../@interfaces';

const useSelectedTagMemosManager = () => {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

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
      enabled: !!selectedTag,
    });

  const { data: initialTags = [] } = useQuery({
    queryKey: ['tags', 'ALL_TAGS'],
    queryFn: getAllTags,
    select: (data) => (isGetTagsResponse(data) ? data.tags : []),
  });

  const [tags, setTags] = useState<Tag[]>(initialTags);

  useEffect(() => {
    if (selectedTag === null) {
      setTags(initialTags);
    }
  }, [initialTags]);

  const handleTagClick = async (tag: Tag | null) => {
    if (tag && tag !== selectedTag) {
      setSelectedTag(tag);
      const response = await getChildTags(tag.id);
      if (isGetTagsResponse(response)) {
        setTags(response.tags);
      } else {
        setTags([]);
      }
    }
  };

  const clickAllTags = async () => {
    setSelectedTag(null);
    const response = await getAllTags();
    if (isGetTagsResponse(response)) {
      setTags(response.tags);
    }
  };

  return {
    viewMemos: selectedTag ? selectedMemosByTag : allMemos,
    tags,
    selectedTag,
    handleTagClick,
    clickAllTags,
  };
};

export default useSelectedTagMemosManager;
