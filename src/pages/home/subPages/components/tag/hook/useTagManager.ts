import { useQueryClient } from '@tanstack/react-query';
import {
  deleteTag,
  editTag,
  isValidResponse,
  paginationDashboardTagRelations,
} from 'api';
import { Tag } from 'pages/home/subPages/interfaces';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertContext } from 'utils';

interface InfiniteQueryData {
  pages: paginationDashboardTagRelations[];
  pageParams: number[];
}

const useTagManager = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { alert, confirmAlert } = useContext(AlertContext);

  const allQueriesData = queryClient.getQueriesData<paginationDashboardTagRelations>(
    {
      queryKey: ['tags'],
      exact: false,
    }
  );

  const handleUpdateTag = async (updatedTag: Tag) => {
    const oldDataMap = new Map();

    // 현재 데이터를 oldDataMap에 저장
    allQueriesData.forEach((query) => {
      const queryKey = query[0] as string[];
      const queryMemos = query[1];

      if (!queryMemos) return;

      oldDataMap.set(queryKey, queryMemos);

      if (queryKey.includes(updatedTag.id)) {
        queryClient.setQueryData(queryKey, (oldData: InfiniteQueryData) => {
          return oldData.pages.map((page: paginationDashboardTagRelations) => ({
            ...page,
            tag: updatedTag,
          }));
        });
        return;
      }

      queryClient.setQueryData(queryKey, (oldData: InfiniteQueryData) => {
        const updatedPages = oldData.pages.map(
          (page: paginationDashboardTagRelations) => {
            const updatedTagRelations = page.tag_relations.map((relation) => {
              const updatedChildTags = relation.child_tags.map((childTag) =>
                childTag.id === updatedTag.id
                  ? { ...childTag, name: updatedTag.name }
                  : childTag
              );

              return {
                ...relation,
                tag:
                  relation.tag.id === updatedTag.id
                    ? { ...relation.tag, name: updatedTag.name }
                    : relation.tag,
                child_tags: updatedChildTags,
              };
            });

            return { ...page, tag_relations: updatedTagRelations };
          }
        );

        return { ...oldData, pages: updatedPages };
      });
    });

    try {
      const response = await editTag(updatedTag.id, updatedTag.name);
      if (!isValidResponse(response)) {
        alert(response.exceptionMessage);

        oldDataMap.forEach((oldData, queryKey) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    } catch (error) {
      alert('다시 시도해주세요');
    }
  };

  const handleDeleteTag = async (tag: Tag) => {
    const confirmed = await confirmAlert(t('pages.dashboard.tag.delete.alert'));

    if (!confirmed) return;

    const oldDataMap = new Map();

    allQueriesData.forEach((query) => {
      const queryKey = query[0] as string[];
      const queryMemos = query[1];

      if (!queryMemos) return;

      oldDataMap.set(queryKey, queryMemos);

      if (queryKey.includes(tag.id)) {
        queryClient.removeQueries({ queryKey });
        return;
      }

      queryClient.setQueryData(queryKey, (oldData: InfiniteQueryData) => {
        const updatedPages = oldData.pages.map(
          (page: paginationDashboardTagRelations) => {
            const filteredTagRelations = page.tag_relations
              .map((relation) => {
                const filteredChildTags = relation.child_tags.filter(
                  (childTag) => childTag.id !== tag.id
                );

                return { ...relation, child_tags: filteredChildTags };
              })
              .filter((relation) => relation.tag.id !== tag.id);

            return { ...page, tag_relations: filteredTagRelations };
          }
        );

        return { ...oldData, pages: updatedPages };
      });
    });

    try {
      const response = await deleteTag(tag.id);
      if (!isValidResponse(response)) {
        alert(response.exceptionMessage);

        oldDataMap.forEach((oldData, queryKey) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    } catch (error) {
      alert('다시 시도해주세요');
    }
  };

  return { handleUpdateTag, handleDeleteTag };
};

export default useTagManager;
