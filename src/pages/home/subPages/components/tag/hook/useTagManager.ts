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

  const backupData = () => {
    const oldDataMap = new Map();
    allQueriesData.forEach(([queryKey, data]) => {
      if (data) {
        oldDataMap.set(queryKey, data);
      }
    });
    return oldDataMap;
  };

  const restoreData = (oldDataMap: Map<string[], InfiniteQueryData>) => {
    oldDataMap.forEach((oldData, queryKey) => {
      queryClient.setQueryData(queryKey, oldData);
    });
  };

  const handleUpdateTag = async (updateTarget: Tag) => {
    const oldDataMap = backupData();
    updateTagDataInQueries(updateTarget);

    try {
      const response = await Api.editTag(updateTarget.id, updateTarget.name);
      if (!Api.isValidResponse(response)) {
        alert(response.exceptionMessage);
        restoreData(oldDataMap);
      }
    } catch {
      alert('다시 시도해주세요');
      restoreData(oldDataMap);
    }
  };

  const updateTagDataInQueries = (updateTarget: Tag) => {
    allQueriesData.forEach(([queryKey, queryData]) => {
      if (!queryData) return;

      queryClient.setQueryData(queryKey, (oldData: InfiniteQueryData) => {
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
  };

  const handleDeleteTag = async (deleteTarget: Tag) => {
    const confirmed = await confirmAlert(t('pages.dashboard.tag.delete.alert'));
    if (!confirmed) return;

    const oldDataMap = backupData();
    deleteTagDataInQueries(deleteTarget);

    try {
      const response = await Api.deleteTag(deleteTarget.id);
      if (!Api.isValidResponse(response)) {
        alert(response.exceptionMessage);
        restoreData(oldDataMap);
      }
    } catch {
      alert('다시 시도해주세요');
      restoreData(oldDataMap);
    }
  };

  const deleteTagDataInQueries = (deleteTarget: Tag) => {
    allQueriesData.forEach(([queryKey, queryData]) => {
      if (!queryData) return;

      queryClient.setQueryData(queryKey, (oldData: InfiniteQueryData) => {
        const updatedPages = oldData.pages.map((page) => {
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
  };

  return { handleUpdateTag, handleDeleteTag };
};

export default useTagManager;
