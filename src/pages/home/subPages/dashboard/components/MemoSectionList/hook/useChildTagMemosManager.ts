import { useInfiniteQuery } from '@tanstack/react-query';
import * as Api from 'api';
import { Memo } from 'pages/home/subPages/interfaces';
import { SortOption } from 'pages/home/subPages/types';
import { useMemo } from 'react';

const MEMO_LIMIT = 10;

const useChildTagMemosManager = (
  tagId: string | null,
  isLinked: boolean,
  sortOption: SortOption,
  memoLimit?: number
) => {
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: [
      'childTagMemos',
      tagId,
      sortOption,
      isLinked,
      memoLimit ? memoLimit : MEMO_LIMIT,
    ],
    queryFn: async ({ pageParam = 1 }: any) => {
      if (!tagId) return;

      const response = await Api.getTagMemos({
        tagId,
        page: pageParam,
        limit: memoLimit ? memoLimit : MEMO_LIMIT,
        isLinked,
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
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchInterval: () => (document.hidden ? false : 20 * 1000),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const memos = useMemo(() => {
    return (
      data?.pages.flatMap(
        (page) =>
          page?.memos.filter((memo): memo is Memo => memo !== undefined) || []
      ) || []
    );
  }, [data]);

  return {
    memos,
    fetchNextPage,
  };
};

export default useChildTagMemosManager;
