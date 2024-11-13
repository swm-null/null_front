import { QueryKey, useQueryClient } from '@tanstack/react-query';
import * as Api from 'api';
import { Tag } from 'pages/home/subPages/interfaces';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertContext, TagContext } from 'utils';

interface TagInfiniteQueryData {
  pages: Api.paginationDashboardTagRelations[];
  pageParams: number[];
}

interface MemoInfiniteQueryData {
  pages: Api.paginationMemos[];
  pageParams: number[];
}

const useTagManager = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { alert, confirmAlert } = useContext(AlertContext);
  const { selectedTag, setSelectedTag, setTagStack } = useContext(TagContext);

  const allTagRelationsQueriesData =
    queryClient.getQueriesData<Api.paginationDashboardTagRelations>({
      queryKey: ['tags'],
      exact: false,
    });

  const allTagsQueriesData = queryClient.getQueriesData<Tag[]>({
    queryKey: ['childTags'],
    exact: false,
  });

  const childTagMemosQueriesData = queryClient.getQueriesData<MemoInfiniteQueryData>(
    {
      queryKey: ['childTagMemos'],
      exact: false,
    }
  );

  const recentMemoQueryData = queryClient.getQueryData<Api.paginationMemos>([
    'recentMemo',
  ]);

  const allMemoQueriesData = useMemo(() => {
    const recentMemoQuery: [QueryKey, Api.paginationMemos | undefined] = [
      ['recentMemo'],
      recentMemoQueryData,
    ];

    return [...childTagMemosQueriesData, recentMemoQuery];
  }, [childTagMemosQueriesData, recentMemoQueryData]);

  const backupTagRelations = () => {
    const oldDataMap = new Map();
    allTagRelationsQueriesData.forEach(([queryKey, data]) => {
      if (data) {
        oldDataMap.set(queryKey, data);
      }
    });
    return oldDataMap;
  };

  const backupTags = () => {
    const oldDataMap = new Map();
    allTagsQueriesData.forEach(([queryKey, data]) => {
      if (data) {
        oldDataMap.set(queryKey, data);
      }
    });
    return oldDataMap;
  };

  const backupMemos = () => {
    const oldDataMap = new Map();
    allMemoQueriesData.forEach(([queryKey, data]) => {
      if (data) {
        oldDataMap.set(queryKey, data);
      }
    });
    return oldDataMap;
  };

  const restoreData = (
    oldTagRelationsMap: Map<string[], TagInfiniteQueryData>,
    oldTags: Map<string[], Tag[]>,
    oldMemos: Map<string[], MemoInfiniteQueryData>
  ) => {
    oldTagRelationsMap.forEach((oldData, queryKey) => {
      queryClient.setQueryData(queryKey, oldData);
    });

    oldTags.forEach((oldData, queryKey) => {
      queryClient.setQueryData(queryKey, oldData);
    });

    oldMemos.forEach((oldData, queryKey) => {
      queryClient.setQueryData(queryKey, oldData);
    });
  };

  const handleUpdateTag = async (updateTarget: Tag) => {
    const oldTagRelationsMap = backupTagRelations();
    const oldTagsMap = backupTags();
    const oldMemosMap = backupMemos();
    updateTagDataInQueries(updateTarget);

    try {
      const response = await Api.editTag(updateTarget.id, updateTarget.name);
      if (!Api.isValidResponse(response)) {
        alert(response.exceptionMessage);
        restoreData(oldTagRelationsMap, oldTagsMap, oldMemosMap);
      }
    } catch {
      alert('다시 시도해주세요');
      restoreData(oldTagRelationsMap, oldTagsMap, oldMemosMap);
    }
  };

  const updateTagDataInQueries = (updateTarget: Tag) => {
    if (selectedTag?.id === updateTarget.id) {
      setSelectedTag((prev) => {
        if (prev) return { id: prev?.id, name: updateTarget?.name };
        return null;
      });
    }

    setTagStack((prev) => {
      if (prev.length === 0) return [];

      return prev.map((tag) => {
        if (tag?.id === updateTarget.id) {
          return { id: tag.id, name: updateTarget.name };
        }
        return tag;
      });
    });

    allTagRelationsQueriesData.forEach(([queryKey, queryData]) => {
      if (!queryData) return;

      queryClient.setQueryData(queryKey, (oldData: TagInfiniteQueryData) => {
        const updatedPages = oldData.pages.map((page) => {
          const updatedTagRelations = page.tag_relations.map((relation) => ({
            ...relation,
            tag:
              relation.tag.id === updateTarget.id
                ? { ...relation.tag, name: updateTarget.name }
                : relation.tag,
            child_tags: relation.child_tags.map((childTag) =>
              childTag.id === updateTarget.id
                ? { ...childTag, name: updateTarget.name }
                : childTag
            ),
          }));
          return { ...page, tag_relations: updatedTagRelations };
        });
        return { ...oldData, pages: updatedPages };
      });
    });

    allTagsQueriesData.forEach(([queryKey, queryData]) => {
      if (!queryData) return;

      queryClient.setQueryData(queryKey, (oldData: Tag[]) => {
        return oldData.map((tag) =>
          tag.id === updateTarget.id ? { ...tag, name: updateTarget.name } : tag
        );
      });
    });

    allMemoQueriesData.forEach(([queryKey, queryData]) => {
      if (!queryData) return;

      queryClient.setQueryData(queryKey, (oldData: MemoInfiniteQueryData) => {
        const updatedPages = oldData.pages.map((page) => {
          if (!page) return page;

          const updatedMemos = page.memos.map((memo) => ({
            ...memo,
            tags: memo.tags.map((tag) =>
              tag.id === updateTarget.id ? { ...tag, name: updateTarget.name } : tag
            ),
          }));
          return { ...page, memos: updatedMemos };
        });
        return { ...oldData, pages: updatedPages };
      });
    });
  };

  const handleDeleteTag = async (deleteTarget: Tag) => {
    const confirmed = await confirmAlert(t('pages.dashboard.tag.delete.alert'));
    if (!confirmed) return;

    const oldTagRelationsMap = backupTagRelations();
    const oldTagsMap = backupTags();
    const oldMemosMap = backupMemos();
    deleteTagDataInQueries(deleteTarget);

    try {
      const response = await Api.deleteTag(deleteTarget.id);
      if (!Api.isValidResponse(response)) {
        alert(response.exceptionMessage);
        restoreData(oldTagRelationsMap, oldTagsMap, oldMemosMap);
      }
    } catch {
      alert('다시 시도해주세요');
      restoreData(oldTagRelationsMap, oldTagsMap, oldMemosMap);
    }
  };

  const deleteTagDataInQueries = (deleteTarget: Tag) => {
    allTagRelationsQueriesData.forEach(([queryKey, queryData]) => {
      if (!queryData) return;

      queryClient.setQueryData(queryKey, (oldData: TagInfiniteQueryData) => {
        const updatedPages = oldData.pages.map((page) => {
          if (!page) return page;
          const filteredTagRelations = page.tag_relations
            .filter((relation) => relation.tag.id !== deleteTarget.id)
            .map((relation) => ({
              ...relation,
              child_tags: relation.child_tags.filter(
                (childTag) => childTag.id !== deleteTarget.id
              ),
            }));
          return { ...page, tag_relations: filteredTagRelations };
        });
        return { ...oldData, pages: updatedPages };
      });
    });

    allTagsQueriesData.forEach(([queryKey, queryData]) => {
      if (!queryData) return;

      queryClient.setQueryData(queryKey, (oldData: Tag[]) => {
        return oldData.filter((tag) => tag.id !== deleteTarget.id);
      });
    });

    const memoIdsToDelete = new Set<string>();
    childTagMemosQueriesData.forEach(([queryKey, queryData]) => {
      const [, tagId] = queryKey;
      if (tagId === deleteTarget.id && queryData?.pages) {
        queryData.pages.forEach((page) => {
          if (!page) return;
          page.memos.forEach((memo) => memoIdsToDelete.add(memo.id));
        });
      }
    });

    allMemoQueriesData.forEach(([queryKey, queryData]) => {
      if (!queryData) return;

      queryClient.setQueryData(queryKey, (oldData: MemoInfiniteQueryData) => {
        const updatedPages = oldData.pages.map((page) => {
          if (!page) return page;

          const updatedMemos = page.memos.filter(
            (memo) => !memoIdsToDelete.has(memo.id)
          );
          return { ...page, memos: updatedMemos };
        });
        return { ...oldData, pages: updatedPages };
      });
    });
  };

  return { handleUpdateTag, handleDeleteTag };
};

export default useTagManager;
