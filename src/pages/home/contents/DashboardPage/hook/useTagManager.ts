// hooks/useTags.ts
import { useState, useEffect } from 'react';
import { getAllTags, getChildTags, isGetTagsResponse } from 'utils/auth';
import { Tag } from '../../@interfaces';

const useTagsManager = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  useEffect(() => {
    // Initial call to fetch all tags
    const fetchAllTags = async () => {
      const response = await getAllTags();
      if (isGetTagsResponse(response)) {
        setTags(response.tags);
      } else {
        setTags([]);
      }
    };

    fetchAllTags();
  }, []);

  useEffect(() => {
    if (selectedTag === null) {
      setTags([]);
    }
  }, [selectedTag]);

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
    tags,
    selectedTag,
    handleTagClick,
    clickAllTags,
  };
};

export default useTagsManager;
