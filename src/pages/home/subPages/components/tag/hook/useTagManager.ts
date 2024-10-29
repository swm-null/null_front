import { useQueryClient } from '@tanstack/react-query';
import * as Api from 'api';
import { Tag } from 'pages/home/subPages/interfaces';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertContext } from 'utils';

interface InfiniteQueryData {
  pages: Api.paginationDashboardTagRelations[];
  pageParams: number[];
}

const useTagManager = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { alert, confirmAlert } = useContext(AlertContext);

  const allQueriesData =
    queryClient.getQueriesData<Api.paginationDashboardTagRelations>({
      queryKey: ['tags'],
      exact: false,
    });

  const handleUpdateTag = async (updateTarget: Tag) => {
    const oldDataMap = new Map();

    allQueriesData.forEach((query) => {
      const queryKey = query[0] as string[];
      const queryMemos = query[1];

      if (!queryMemos) return;

      oldDataMap.set(queryKey, queryMemos);

      if (queryKey.includes(updateTarget.id)) {
        queryClient.setQueryData(queryKey, (oldData: InfiniteQueryData) => {
          return oldData.pages.map((page: Api.paginationDashboardTagRelations) => ({
            ...page,
            tag: updateTarget,
          }));
        });
        return;
      }

      queryClient.setQueryData(queryKey, (oldData: InfiniteQueryData) => {
        const updatedPages = oldData.pages.map(
          (page: Api.paginationDashboardTagRelations) => {
            const updatedTagRelations = page.tag_relations.map((relation) => {
              const updatedChildTags = relation.child_tags.map((childTag) =>
                childTag.id === updateTarget.id
                  ? { ...childTag, name: updateTarget.name }
                  : childTag
              );

              return {
                ...relation,
                tag:
                  relation.tag.id === updateTarget.id
                    ? { ...relation.tag, name: updateTarget.name }
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
      const response = await Api.editTag(updateTarget.id, updateTarget.name);
      if (!Api.isValidResponse(response)) {
        alert(response.exceptionMessage);

        oldDataMap.forEach((oldData, queryKey) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    } catch (error) {
      alert('다시 시도해주세요');
    }
  };

  const handleDeleteTag = async (deleteTarget: Tag) => {
    const confirmed = await confirmAlert(t('pages.dashboard.tag.delete.alert'));

    if (!confirmed) return;

    const oldDataMap = new Map();

    allQueriesData.forEach((query) => {
      const queryKey = query[0] as string[];
      const queryMemos = query[1];

      if (!queryMemos) return;

      oldDataMap.set(queryKey, queryMemos);

      if (queryKey.includes(deleteTarget.id)) {
        queryClient.removeQueries({ queryKey });
        return;
      }

      queryClient.setQueryData(queryKey, (oldData: InfiniteQueryData) => {
        const updatedPages = oldData.pages.map(
          (page: Api.paginationDashboardTagRelations) => {
            const filteredTagRelations = page.tag_relations
              .map((relation) => {
                const filteredChildTags = relation.child_tags.filter(
                  (childTag) => childTag.id !== deleteTarget.id
                );

                return { ...relation, child_tags: filteredChildTags };
              })
              .filter((relation) => relation.tag.id !== deleteTarget.id);

            return { ...page, tag_relations: filteredTagRelations };
          }
        );

        return { ...oldData, pages: updatedPages };
      });
    });

    try {
      const response = await Api.deleteTag(deleteTarget.id);
      if (!Api.isValidResponse(response)) {
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
