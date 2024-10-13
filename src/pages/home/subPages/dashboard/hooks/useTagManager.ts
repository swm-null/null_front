import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Tag } from 'pages/home/subPages/interfaces';

const useTagsManager = () => {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const queryClient = useQueryClient();
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
    selectedTag,
    handleTagOrAllTagsClick,
  };
};

export default useTagsManager;
