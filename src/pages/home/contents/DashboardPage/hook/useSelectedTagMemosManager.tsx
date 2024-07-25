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
    handleTagClick,
    clickAllTags,
    updateViewMemo,
    deleteViewMemo,
    revertViewMemo,
  };
};

export default useSelectedTagMemosManager;
