import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import * as Api from 'api';
import { useContext, useEffect, useMemo } from 'react';
import { CreateResetContext } from 'utils';

const useRecentMemoManager = () => {
  const { subscribeToInvalid, unsubscribeFromInvalid } =
    useContext(CreateResetContext);
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery<Api.paginationMemosResponse, Error>({
      queryKey: ['recentMemo'],
      queryFn: async ({ pageParam = 1 }: any) => {
        const response = await Api.getRecentMemos(pageParam, 10);
        if (!Api.isMemosResponse(response)) {
          throw new Error('메모를 가져오는 중 오류가 발생했습니다.');
        }
        return response;
      },
      getNextPageParam: (lastPage) => {
        return lastPage.total_page > lastPage.current_page
          ? lastPage.current_page + 1
          : undefined;
      },
      initialPageParam: 1,
      gcTime: 0,
    });

  const allMemos = useMemo(() => {
    if (isLoading || !data) return [];
    return data.pages.flatMap((page) => page.memos ?? []);
  }, [data, isLoading]);

  useEffect(() => {
    const invalidateCurrentQuery = () => {
      queryClient.invalidateQueries({
        queryKey: ['recentMemo'],
        exact: true,
      });
    };

    subscribeToInvalid(invalidateCurrentQuery);

    return () => {
      unsubscribeFromInvalid(invalidateCurrentQuery);
    };
  }, []);

  return {
    data: allMemos,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export default useRecentMemoManager;
