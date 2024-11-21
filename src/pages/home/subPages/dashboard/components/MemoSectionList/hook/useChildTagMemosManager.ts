import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import * as Api from 'api';
import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { SortOption } from 'pages/home/subPages/types';
import { useContext, useEffect, useMemo } from 'react';
import { DashboardResetContext } from 'utils';

const MEMO_LIMIT = 10;

const useChildTagMemosManager = (
  tag: Tag | null,
  isLinked: boolean,
  sortOption: SortOption,
  memoLimit?: number
) => {
  const { subscribeToInvalid, unsubscribeFromInvalid } =
    useContext(DashboardResetContext);
  const queryClient = useQueryClient();

  const { data, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: [
      'childTagMemos',
      JSON.stringify(tag),
      sortOption,
      isLinked,
      memoLimit ? memoLimit : MEMO_LIMIT,
    ],
    queryFn: async ({ pageParam = 1 }: any) => {
      if (!tag) return;

      const response = await Api.getTagMemos({
        tagId: tag.id,
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
    refetchOnWindowFocus: true,
    gcTime: 0,
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
    const invalidateCurrentQuery = () => {
      queryClient.invalidateQueries({
        queryKey: [
          'childTagMemos',
          JSON.stringify(tag),
          sortOption,
          isLinked,
          memoLimit ? memoLimit : MEMO_LIMIT,
        ],
        exact: true,
      });
    };

    subscribeToInvalid(invalidateCurrentQuery);
    subscribeToInvalid(refetch);

    return () => {
      unsubscribeFromInvalid(invalidateCurrentQuery);
      unsubscribeFromInvalid(refetch);
    };
  }, [tag?.id]);

  return {
    memos,
    fetchNextPage,
  };
};

export default useChildTagMemosManager;
