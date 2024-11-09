import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import * as Api from 'api';
import { Memo } from 'pages/home/subPages/interfaces';
import { SortOption } from 'pages/home/subPages/types';
import { useContext, useEffect, useMemo } from 'react';
import { TagContext } from 'utils';

const MEMO_LIMIT = 10;

const useChildTagMemosManager = (
  tagId: string | null,
  isLinked: boolean,
  sortOption: SortOption,
  memoLimit?: number
) => {
  const { subscribeToReset, unsubscribeFromReset } = useContext(TagContext);
  const queryClient = useQueryClient();

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
    enabled: !!tagId,
    gcTime: 0,
    initialPageParam: 1,
    refetchOnWindowFocus: true,
  });

  const memos = useMemo(() => {
    return (
      data?.pages.flatMap(
        (page) =>
          page?.memos.filter((memo): memo is Memo => memo !== undefined) || []
      ) || []
    );
  }, [data]);

  useEffect(() => {
    const resetQueriesCurrentQuery = () => {
      queryClient.resetQueries({
        queryKey: [
          'childTagMemos',
          tagId,
          sortOption,
          isLinked,
          memoLimit ? memoLimit : MEMO_LIMIT,
        ],
        exact: true,
      });
    };

    subscribeToReset(resetQueriesCurrentQuery);

    return () => {
      unsubscribeFromReset(resetQueriesCurrentQuery);
    };
  }, [tagId]);

  return {
    memos,
    fetchNextPage,
  };
};

export default useChildTagMemosManager;
