import { useInfiniteQuery } from '@tanstack/react-query';
import * as Api from 'api';
import { SortOption } from 'pages/home/subPages/dashboard/interfaces';

const MEMO_LIMIT = 10;

const useChildTagMemosManager = (
  tagId: string | null,
  isLinked: boolean,
  sortOption: SortOption
) => {
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['childTagMemos', tagId, sortOption, isLinked],
    queryFn: async ({ pageParam = 1 }: any) => {
      if (!tagId) return;

      const response = await Api.getTagMemos({
        tagId,
        page: pageParam,
        limit: MEMO_LIMIT,
        isLinked: isLinked,
        sortOrder: sortOption,
      });

      if (!Api.isMemosResponse(response)) {
        throw new Error('자식 태그 메모를 불러오는 중 오류가 발생했습니다.');
      }

      return response;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const nextPage = lastPage.current_page + 1;
      return nextPage <= lastPage.total_page ? nextPage : undefined;
    },
    initialPageParam: 1,
    enabled: !!tagId,
  });

  const memos = data?.pages.flatMap((page) => page?.memos) || [];

  return {
    memos,
    fetchNextPage,
  };
};

export default useChildTagMemosManager;
