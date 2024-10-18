import { useEffect, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Tag, TagRelation } from 'pages/home/subPages/interfaces';
import { SortOption } from 'pages/home/subPages/dashboard/interfaces';
import * as Api from 'api';

const TAG_LIMIT = 10;
const MEMO_LIMIT = 10;

const useTagsManager = (sortOption: SortOption) => {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [tagRelations, setTagRelations] = useState<TagRelation[]>([]);

  const queryClient = useQueryClient();

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

  const { data: tagData, fetchNextPage } = useInfiniteQuery({
    queryKey: ['tags', selectedTag?.id],
    queryFn: async ({ pageParam = 1 }: any) => {
      const response = await Api.getDashboardTagRelation({
        parentTagId: selectedTag?.id,
        tagPage: pageParam,
        tagLimit: TAG_LIMIT,
        memoLimit: MEMO_LIMIT,
        sortOrder: sortOption,
      });

      if (!Api.isDashboardTagRelationResponse(response)) {
        throw new Error('대시보드 데이터를 가져오는 중 오류가 발생했습니다.');
      }

      return response;
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.current_page + 1;
      return nextPage <= lastPage.total_page ? nextPage : undefined;
    },
    initialPageParam: 1,
    enabled: !!selectedTag?.id,
  });

  useEffect(() => {
    if (!tagData) return;

    const newMemoSectionList = tagData.pages.flatMap(
      (page) => page.tag_relations
    );

    setTagRelations(newMemoSectionList);
  }, [tagData]);

  return {
    selectedTag,
    tagRelations,
    handleTagOrAllTagsClick,
    fetchNextPage,
  };
};

export default useTagsManager;
