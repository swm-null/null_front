import { useEffect, useCallback, useState, useMemo } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { SortOption } from 'pages/home/subPages/dashboard/interfaces';
import * as Api from 'api';

const TAG_LIMIT = 15;
const MEMO_LIMIT = 10;

const useSelectedTagMemosManager = (
  selectedTag: Tag | null,
  sortOption: SortOption
) => {
  const queryClient = useQueryClient();
  const [memoSectionListByTag, setMemoSectionListByTag] = useState<
    { tag: Tag | null; childTags: Tag[] | null; memos: Memo[] }[]
  >([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const {
    data: fetchedMemos,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery<Api.paginationDashboardResponse, Error>({
    queryKey: useMemo(
      () => ['memos', MEMO_LIMIT, sortOption],
      [selectedTag, MEMO_LIMIT, sortOption]
    ),
    queryFn: async ({ pageParam = 1 }: any) => {
      const response =
        selectedTag !== null
          ? await Api.getDashboardDataByTag({
              parentTagId: selectedTag.id,
              tagPage: pageParam,
              tagLimit: TAG_LIMIT,
              memoLimit: MEMO_LIMIT,
              sortOrder: sortOption,
            })
          : await Api.getDashboardDataByTag({
              tagPage: pageParam,
              tagLimit: TAG_LIMIT,
              memoLimit: MEMO_LIMIT,
              sortOrder: sortOption,
            });

      if (!Api.isGetDashboardDataByTag(response)) {
        throw new Error('대시보드 데이터를 가져오는 중 오류가 발생했습니다.');
      }
      return response as Api.paginationDashboardResponse;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.total_page > lastPage.current_page
        ? lastPage.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  // 메모 상태 업데이트
  const updateMemoState = (
    updateFn: (
      prev: { tag: Tag; memos: Memo[] }[]
    ) => { tag: Tag; memos: Memo[] }[]
  ) => {
    queryClient.setQueryData(['memos'], updateFn);
  };

  const updateMemoFromMemoSectionListByTag = useCallback(
    (tag: Tag, newMemo: Memo) =>
      updateMemoState((prev) =>
        prev.map((taggedMemo) => {
          if (taggedMemo.tag.id !== tag.id) {
            return taggedMemo;
          }
          return {
            ...taggedMemo,
            memos: taggedMemo.memos.map((memo) =>
              memo.id === newMemo.id ? newMemo : memo
            ),
          };
        })
      ),
    []
  );

  const deleteMemoFromMemoSectionListByTag = useCallback(
    (tag: Tag, memoId: string) =>
      updateMemoState((prev) =>
        prev.map((taggedMemo) => {
          if (taggedMemo.tag.id !== tag.id) {
            return taggedMemo;
          }

          return {
            ...taggedMemo,
            memos: taggedMemo.memos.filter((memo) => memo.id !== memoId),
          };
        })
      ),
    []
  );

  const revertMemoFromMemoSectionListByTag = useCallback(
    (tag: Tag, index: number, memo: Memo) =>
      updateMemoState((prev) =>
        prev.map((taggedMemo) => {
          if (taggedMemo.tag.id !== tag.id) {
            return taggedMemo;
          }

          return {
            ...taggedMemo,
            memos: [
              ...taggedMemo.memos.slice(0, index),
              memo,
              ...taggedMemo.memos.slice(index),
            ],
          };
        })
      ),
    []
  );

  // fetchedMemos와 memoSectionListByTag 비교하여 업데이트
  useEffect(() => {
    if (!fetchedMemos) return;

    const newChildMemoSectionList = fetchedMemos.pages.flatMap((page) =>
      page.child_tags_with_memos.map((childTag) => ({
        tag: childTag.tag,
        childTags: [],
        memos: childTag.memos,
      }))
    );

    const newTagMemoSection = fetchedMemos.pages.map((page) => ({
      tag: null,
      childTags: [],
      memos: page.tag_with_memos.memos,
    }));

    const newMemoSectionList = [
      ...newTagMemoSection,
      ...newChildMemoSectionList,
    ];

    console.log(newMemoSectionList);

    const newTags = newMemoSectionList
      .map((page) => page.tag)
      .filter((tag) => tag !== null);

    if (
      JSON.stringify(memoSectionListByTag) !==
      JSON.stringify(newMemoSectionList)
    ) {
      setMemoSectionListByTag(newMemoSectionList);
    }

    if (JSON.stringify(tags) !== JSON.stringify(newTags)) {
      setTags(newTags);
    }
  }, [fetchedMemos?.pageParams, memoSectionListByTag]);

  useEffect(() => {
    refetch();
  }, [refetch, MEMO_LIMIT, sortOption]);

  return {
    memoSectionListByTag,
    tags,
    fetchNextPage,
    updateMemoFromMemoSectionListByTag,
    deleteMemoFromMemoSectionListByTag,
    revertMemoFromMemoSectionListByTag,
  };
};

export default useSelectedTagMemosManager;
