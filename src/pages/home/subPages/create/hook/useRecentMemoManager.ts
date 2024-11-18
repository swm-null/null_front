import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import * as Api from 'api';
import { useContext, useEffect } from 'react';
import { ResetContext } from 'utils';

const useRecentMemoManager = () => {
  const { subscribeToReset, unsubscribeFromReset } = useContext(ResetContext);
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
      staleTime: 600000,
    });

  const allMemos =
    !isLoading && data ? data.pages.flatMap((page) => page.memos ?? []) : [];

  useEffect(() => {
    const invalidateCurrentQuery = () => {
      queryClient.invalidateQueries({
        queryKey: ['recentMemo'],
        exact: true,
      });
    };

    subscribeToReset('', invalidateCurrentQuery);

    return () => {
      unsubscribeFromReset('', invalidateCurrentQuery);
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
