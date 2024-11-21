import { useQueryClient } from '@tanstack/react-query';
import * as Api from 'api';
import { Tag } from 'pages/home/subPages/interfaces';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertContext, TagContext } from 'utils';

const useTagManager = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { alert, confirmAlert } = useContext(AlertContext);
  const { selectedTag, setSelectedTag, setTagStack } = useContext(TagContext);

  const handleCreateTag = async (
    parentTag: Tag | null,
    createTargetName: string
  ) => {
    try {
      const response = await Api.createTag(parentTag, createTargetName.trim());
      if (Api.isGetTagResponse(response)) {
        queryClient.invalidateQueries({
          queryKey: ['tags', parentTag ? parentTag.id : 'root'],
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: ['childTags', parentTag ? parentTag.id : 'root'],
          exact: true,
        });
      }
    } catch {}
  };

  const handleUpdateTag = async (parentTag: Tag | null, updateTarget: Tag) => {
    try {
      const response = await Api.editTag(updateTarget.id, updateTarget.name);
      if (Api.isValidResponse(response)) {
        queryClient.invalidateQueries({
          queryKey: ['tags', parentTag ? parentTag.id : 'root'],
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: ['childTags', parentTag ? parentTag.id : 'root'],
          exact: true,
        });
        queryClient.invalidateQueries({ queryKey: ['childTagMemos'] });
      }
    } catch {
      alert('다시 시도해주세요');
    }
  };

  const handleDeleteTag = async (parentTag: Tag | null, deleteTarget: Tag) => {
    const confirmed = await confirmAlert(t('pages.dashboard.tag.delete.alert'));
    if (!confirmed) return;

    try {
      const response = await Api.deleteTag(deleteTarget.id);
      if (Api.isValidResponse(response)) {
        if (selectedTag && selectedTag.id === deleteTarget.id) {
          setTagStack((prev) => [...prev.slice(0, -1)]);
          setSelectedTag(parentTag);
        }

        queryClient.invalidateQueries({
          queryKey: ['tags', parentTag ? parentTag.id : 'root'],
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: ['childTags', parentTag ? parentTag.id : 'root'],
          exact: true,
        });
        queryClient.invalidateQueries({ queryKey: ['childTagMemos'] });
      }
    } catch {
      alert('다시 시도해주세요');
    }
  };

  return { handleCreateTag, handleUpdateTag, handleDeleteTag };
};

export default useTagManager;
