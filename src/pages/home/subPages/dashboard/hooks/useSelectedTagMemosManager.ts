import { useEffect, useCallback, useState, useMemo } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { SortOption } from 'pages/home/subPages/dashboard/interfaces';
import * as Api from 'api';

const TAG_LIMIT = 5;
const MEMO_LIMIT = 5;

const useSelectedTagMemosManager = (
  selectedTag: Tag | null,
  sortOption: SortOption
) => {
  const queryClient = useQueryClient();
  const [memoSectionListByTag, setMemoSectionListByTag] = useState<
    { tag: Tag | null; childTags: Tag[] | null; memos: Memo[] }[]
  >([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [childTagPages, setChildTagPages] = useState<
    Record<string, { currentPage: number; totalPage: number } | undefined>
  >({});
  const [rootTag, setRootTag] = useState<Tag>();

  const {
    data: fetchedMemos,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery<Api.paginationDashboardResponse, Error>({
    queryKey: useMemo(
      () => ['memos', selectedTag?.id, MEMO_LIMIT, sortOption],
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

      if (!Api.isGetDashboardData(response)) {
        throw new Error('대시보드 데이터를 가져오는 중 오류가 발생했습니다.');
      }

      response.child_tags_with_memos.forEach((childTag) => {
        setChildTagPages((prev) => ({
          ...prev,
          [childTag.tag.id]: {
            currentPage: childTag.current_page,
            totalPage: childTag.total_page,
          },
        }));
      });

      if (response.tag_with_memos && response.tag_with_memos.tag.name === '@') {
        setChildTagPages((prev) => ({
          ...prev,
          [response.tag_with_memos.tag.id]: {
            currentPage: response.tag_with_memos.current_page,
            totalPage: response.tag_with_memos.total_page,
          },
        }));
        setRootTag(response.tag_with_memos.tag);
      }

      return response as Api.paginationDashboardResponse;
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.current_page + 1;
      return nextPage <= lastPage.total_page ? nextPage : undefined;
    },
    initialPageParam: 1,
  });

  const fetchNextPageForChildTag = async (childTag: Tag | null) => {
    if (!rootTag) return;

    const targetTagId = childTag ? childTag.id : rootTag?.id;
    const childTagPageData = childTagPages[targetTagId];

    if (!childTagPageData) return;

    const { currentPage, totalPage } = childTagPageData;

    if (currentPage >= totalPage) {
      // 이미 마지막 페이지인 경우 더 이상 요청하지 않음
      return;
    }

    const nextPage = currentPage + 1;

    const response = await Api.getChildTagSectionData({
      tagId: targetTagId,
      memoPage: nextPage,
      memoLimit: MEMO_LIMIT,
      sortOrder: sortOption,
    });

    if (!response || !Api.isGetChildTagSectionData(response)) {
      throw new Error('자식 태그 메모를 불러오는 중 오류가 발생했습니다.');
    }

    setChildTagPages((prevPages) => {
      return {
        ...prevPages,
        [targetTagId]: {
          currentPage: response.current_page,
          totalPage: totalPage,
        },
      };
    });

    // 자식 태그에 대한 새 데이터를 기존 memoSectionListByTag에 추가
    queryClient.setQueryData(
      ['memos', selectedTag?.id, MEMO_LIMIT, sortOption],
      (prev: any) => {
        if (!prev) return prev; // 기존 데이터가 없는 경우

        // 자식 태그의 메모 업데이트
        return {
          ...prev,
          pages: prev.pages.flatMap((page: any) => {
            const updatedTagWithMemos =
              page.tag_with_memos.tag.id === targetTagId
                ? {
                    ...page.tag_with_memos,
                    memos: [...page.tag_with_memos.memos, ...response.memos],
                  }
                : { ...page.tag_with_memos };

            const updatedChildTagsWithMemos = page.child_tags_with_memos.map(
              (tagSection: any) => {
                if (tagSection.tag.id === targetTagId) {
                  return {
                    ...tagSection,
                    memos: [...tagSection.memos, ...response.memos],
                  };
                }
                return { ...tagSection };
              }
            );

            return {
              ...page,
              child_tags_with_memos: updatedChildTagsWithMemos,
              tag_with_memos: updatedTagWithMemos,
            };
          }),
        };
      }
    );
  };

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

  useEffect(() => {
    if (!fetchedMemos) return;

    const newChildMemoSectionList = fetchedMemos.pages.flatMap((page) =>
      page.child_tags_with_memos.map((childTag) => {
        return {
          tag: childTag.tag,
          childTags: [],
          memos: childTag.memos,
        };
      })
    );

    const newTagMemoSection = fetchedMemos.pages.map((page) => {
      return {
        tag: null,
        childTags: [],
        memos: page.tag_with_memos.memos,
      };
    });

    const newMemoSectionList = [
      ...newTagMemoSection,
      ...newChildMemoSectionList,
    ];

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
  }, [fetchedMemos, selectedTag]);

  useEffect(() => {
    refetch();
  }, [refetch, MEMO_LIMIT, sortOption]);

  return {
    memoSectionListByTag,
    tags,
    fetchNextPage,
    fetchNextPageForChildTag,
    updateMemoFromMemoSectionListByTag,
    deleteMemoFromMemoSectionListByTag,
    revertMemoFromMemoSectionListByTag,
  };
};

export default useSelectedTagMemosManager;
