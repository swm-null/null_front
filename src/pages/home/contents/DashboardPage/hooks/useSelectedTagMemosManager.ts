import { useEffect, useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getChildTags,
  getSelectedTagMemos,
  isGetMemosResponse,
  isGetTagsResponse,
} from 'utils/auth';
import { Memo, Tag } from '../../_interfaces';

const useSelectedTagMemosManager = (tags: Tag[] | null) => {
  const queryClient = useQueryClient();
  const [taggedMemos, setTaggedMemos] = useState<
    { tag: Tag; childTags: Tag[]; memos: Memo[] }[]
  >([]);

  const fetchSelectedTagMemos = async (tagId: string) => {
    const response = await getSelectedTagMemos(tagId);
    if (isGetMemosResponse(response)) {
      return response.memos;
    } else {
      return [];
    }
  };

  const fetchChildTags = async (tagId: string) => {
    const response = await getChildTags(tagId);
    if (isGetTagsResponse(response)) {
      return response.tags;
    } else {
      return [];
    }
  };

  const { data: fetchedMemos = [], refetch } = useQuery({
    queryKey: ['memos', tags ? tags.map((tag) => tag.id) : 'NO_TAGS'],
    queryFn: async () => {
      if (tags && tags.length > 0) {
        const tagMemos = await Promise.all(
          tags.map(async (tag) => {
            const memos = await fetchSelectedTagMemos(tag.id);
            const childTags = await fetchChildTags(tag.id);
            return { tag, childTags, memos };
          })
        );
        return tagMemos;
      } else {
        return [];
      }
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    setTaggedMemos(fetchedMemos);
  }, [fetchedMemos]);

  const updateViewMemo = useCallback(
    (tag: Tag, newMemo: Memo) => {
      queryClient.setQueryData(
        ['memos', tags ? tags.map((tag) => tag.id) : 'NO_TAGS'],
        (prev: { tag: Tag; memos: Memo[] }[] = []) =>
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
      );
    },
    [queryClient, tags]
  );

  const deleteViewMemo = useCallback(
    (tag: Tag, memoId: string) => {
      queryClient.setQueryData(
        ['memos', tags ? tags.map((tag) => tag.id) : 'NO_TAGS'],
        (prev: { tag: Tag; memos: Memo[] }[] = []) =>
          prev.map((taggedMemo) =>
            taggedMemo.tag.id === tag.id
              ? {
                  ...taggedMemo,
                  memos: taggedMemo.memos.filter((memo) => memo.id !== memoId),
                }
              : taggedMemo
          )
      );
    },
    [queryClient, tags]
  );

  const revertViewMemo = useCallback(
    (tag: Tag, index: number, memo: Memo) => {
      queryClient.setQueryData(
        ['memos', tags ? tags.map((tag) => tag.id) : 'NO_TAGS'],
        (prev: { tag: Tag; memos: Memo[] }[] = []) =>
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
      );
    },
    [queryClient, tags]
  );

  useEffect(() => {
    refetch();
  }, [tags, refetch]);

  return {
    taggedMemos,
    updateViewMemo,
    deleteViewMemo,
    revertViewMemo,
  };
};

export default useSelectedTagMemosManager;
