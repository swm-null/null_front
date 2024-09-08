import { useEffect, useCallback, useState, useMemo } from 'react';
import { catchError, forkJoin, from, lastValueFrom, map, of } from 'rxjs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Memo, Tag } from 'pages/home/contents/_interfaces';
import * as Api from 'utils/auth';

const useSelectedTagMemosManager = (
  tags: Tag[] | null,
  selectedTag: Tag | null
) => {
  const queryClient = useQueryClient();
  const [memoSectionListByTag, setMemoSectionListByTag] = useState<
    { tag: Tag; childTags: Tag[] | null; memos: Memo[] }[]
  >([]);

  const { data: fetchedMemos = [], refetch } = useQuery({
    queryKey: useMemo(
      () => ['memos', tags?.map((tag) => tag.id) || selectedTag?.id],
      [tags, selectedTag]
    ),
    queryFn: async () => {
      if (tags?.length) {
        return lastValueFrom(forkJoin(tags.map(fetchTagData)));
      } else if (selectedTag) {
        return lastValueFrom(
          fetchMemosByTag(selectedTag.id).pipe(
            map((memos) => [{ tag: selectedTag, childTags: null, memos }])
          )
        );
      }
      return [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const fetchTagData = (tag: Tag) => {
    return forkJoin({
      memos: fetchMemosByTag(tag.id),
      childTags: fetchChildTags(tag.id),
    }).pipe(map(({ memos, childTags }) => ({ tag, childTags, memos })));
  };

  const fetchMemosByTag = (tagId: string) => {
    return from(Api.getMemosByTag(tagId)).pipe(
      map((response) => {
        if (Api.isGetMemosResponse(response)) {
          return response.memos;
        } else {
          throw new Error('서버에서 올바른 응답을 받지 못했습니다.');
        }
      }),
      catchError((error) => {
        alert(error.message || '메모를 불러오는 중 오류가 발생했습니다.');
        return of([]);
      })
    );
  };

  const fetchChildTags = (tagId: string) => {
    return from(Api.getChildTags(tagId)).pipe(
      map((response) => (Api.isGetTagsResponse(response) ? response.tags : []))
    );
  };

  // 변경 내용을 서버에 반영되기 전에 query에 캐쉬
  const updateMemoState = (
    updateFn: (
      prev: { tag: Tag; memos: Memo[] }[]
    ) => { tag: Tag; memos: Memo[] }[]
  ) => {
    queryClient.setQueryData(
      ['memos', tags?.map((tag) => tag.id) || 'NO_TAGS'],
      updateFn
    );
  };

  const updateMemoFromMemoSectionListByTag = useCallback(
    (tag: Tag, newMemo: Memo) =>
      updateMemoState((prev) =>
        prev.map((taggedMemo) =>
          taggedMemo.tag.id === tag.id
            ? {
                ...taggedMemo,
                memos: taggedMemo.memos.map((memo) =>
                  memo.id === newMemo.id ? newMemo : memo
                ),
              }
            : taggedMemo
        )
      ),
    [tags]
  );

  const deleteMemoFromMemoSectionListByTag = useCallback(
    (tag: Tag, memoId: string) =>
      updateMemoState((prev) =>
        prev.map((taggedMemo) =>
          taggedMemo.tag.id === tag.id
            ? {
                ...taggedMemo,
                memos: taggedMemo.memos.filter((memo) => memo.id !== memoId),
              }
            : taggedMemo
        )
      ),
    [tags]
  );

  const revertMemoFromMemoSectionListByTag = useCallback(
    (tag: Tag, index: number, memo: Memo) =>
      updateMemoState((prev) =>
        prev.map((taggedMemo) =>
          taggedMemo.tag.id === tag.id
            ? {
                ...taggedMemo,
                memos: [
                  ...taggedMemo.memos.slice(0, index),
                  memo,
                  ...taggedMemo.memos.slice(index),
                ],
              }
            : taggedMemo
        )
      ),
    [tags]
  );

  useEffect(() => {
    if (JSON.stringify(fetchedMemos) !== JSON.stringify(memoSectionListByTag)) {
      setMemoSectionListByTag(fetchedMemos);
    }
  }, [fetchedMemos, memoSectionListByTag]);

  useEffect(() => {
    refetch();
  }, [tags, refetch]);

  return {
    memoSectionListByTag,
    updateMemoFromMemoSectionListByTag,
    deleteMemoFromMemoSectionListByTag,
    revertMemoFromMemoSectionListByTag,
  };
};

export default useSelectedTagMemosManager;
