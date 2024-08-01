import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getChildTags, getRootTags, isGetTagsResponse } from 'utils/auth';
import { Tag } from '../../@interfaces';

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

  const handleTagClick = (tag: Tag | null) => {
    setSelectedTag(tag);
    if (tag) {
      queryClient.invalidateQueries({ queryKey: ['tags', tag.id] });
    } else {
      queryClient.invalidateQueries({ queryKey: ['tags', 'root'] });
    }
  };

  const clickAllTags = () => {
    setSelectedTag(null);
    queryClient.invalidateQueries({ queryKey: ['tags', 'root'] });
  };

  return {
    tags,
    selectedTag,
    handleTagClick,
    clickAllTags,
    isLoading,
    isError,
  };
};

export default useTagsManager;
