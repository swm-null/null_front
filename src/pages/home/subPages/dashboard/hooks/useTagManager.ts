import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Tag } from 'pages/home/subPages/interfaces';
import { getChildTags, getRootTags, isGetTagsResponse } from 'api';

const useTagsManager = () => {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const queryClient = useQueryClient();

  const fetchAllTags = async () => {
    const response = await getRootTags();
    if (isGetTagsResponse(response)) {
      return response.tags;
    } else {
      return [];
    }
  };

  const fetchChildTags = async (tagId: string) => {
    const response = await getChildTags(tagId);
    if (isGetTagsResponse(response)) {
      return response.tags;
    } else {
      return [];
    }
  };

  const {
    data: tags = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['tags', selectedTag ? selectedTag.id : 'root'],
    queryFn: () =>
      selectedTag ? fetchChildTags(selectedTag.id) : fetchAllTags(),
  });

  /**
   * @param tag Tag: 특정 태그, null: 모든 메모
   */
  const handleTagOrAllTagsClick = (tag: Tag | null) => {
    if (tag) {
      clickTag(tag);
    } else {
      clickAllTags();
    }
  };

  const clickTag = (tag: Tag) => {
    setSelectedTag(tag);
    queryClient.invalidateQueries({ queryKey: ['tags', tag.id] });
  };

  const clickAllTags = () => {
    setSelectedTag(null);
    queryClient.invalidateQueries({ queryKey: ['tags', 'root'] });
  };

  return {
    tags,
    selectedTag,
    handleTagOrAllTagsClick,
    isLoading,
    isError,
  };
};

export default useTagsManager;
