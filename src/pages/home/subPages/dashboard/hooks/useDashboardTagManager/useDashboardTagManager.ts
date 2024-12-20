import { useContext, useEffect, useState } from 'react';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { Tag, TagRelation } from 'pages/home/subPages/interfaces';
import { DashboardResetContext, TagContext } from 'utils';
import {
  getChildTags,
  getDashboardTagRelations,
  isDashboardTagRelationsResponse,
  isGetTagsResponse,
} from './api';

const TAG_LIMIT = 10;

const useDashboardTagManager = () => {
  const { selectedTag, setSelectedTag } = useContext(TagContext);
  const [tagRelations, setTagRelations] = useState<TagRelation[]>([]);

  const {
    subscribeToReset,
    subscribeToInvalid,
    unsubscribeFromReset,
    unsubscribeFromInvalid,
  } = useContext(DashboardResetContext);

  const queryClient = useQueryClient();

  const { data: tagData, fetchNextPage } = useInfiniteQuery({
    queryKey: ['tags', selectedTag ? selectedTag.id : 'root'],
    networkMode: 'always',
    queryFn: async ({ pageParam = 1 }: any) => {
      const response = await getDashboardTagRelations({
        tagId: selectedTag?.id,
        page: pageParam,
        limit: TAG_LIMIT,
      });

      if (!isDashboardTagRelationsResponse(response)) {
        return {
          current_page: 0,
          total_page: 0,
          tag: selectedTag?.id,
          tag_relations: [],
        };
      }

      return response;
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.current_page + 1;
      return nextPage <= lastPage.total_page ? nextPage : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: true,
    gcTime: 0,
  });

  const { data: childTags } = useQuery({
    queryKey: ['childTags', selectedTag ? selectedTag.id : 'root'],
    networkMode: 'always',
    queryFn: async () => {
      const response = await getChildTags(selectedTag?.id);

      if (!isGetTagsResponse(response)) {
        return [];
      }

      return response.tags;
    },
    staleTime: 600000,
  });

  const handleTagOrAllTagsClick = (tag: Tag | null) => {
    if (tag) {
      clickTag(tag);
    } else {
      clickAllTags();
    }
  };

  const clickTag = (tag: Tag) => {
    setSelectedTag(tag);
  };

  const clickAllTags = () => {
    setSelectedTag(null);
  };

  useEffect(() => {
    if (!tagData) return;

    const newMemoSectionList = tagData.pages.flatMap((page) => page.tag_relations);
    setTagRelations(newMemoSectionList);
  }, [tagData]);

  useEffect(() => {
    const invalidateCurrentQuery = () => {
      queryClient.invalidateQueries({
        queryKey: ['tags', selectedTag ? selectedTag.id : 'root'],
      });

      queryClient.invalidateQueries({
        queryKey: ['childTags', selectedTag ? selectedTag.id : 'root'],
      });
    };

    subscribeToInvalid(invalidateCurrentQuery);
    subscribeToReset(invalidateCurrentQuery);

    return () => {
      unsubscribeFromInvalid(invalidateCurrentQuery);
      unsubscribeFromReset(invalidateCurrentQuery);
    };
  }, [selectedTag]);

  return {
    childTags: childTags ? childTags : [],
    tagRelations,
    handleTagOrAllTagsClick,
    fetchNextPage,
  };
};

export default useDashboardTagManager;
