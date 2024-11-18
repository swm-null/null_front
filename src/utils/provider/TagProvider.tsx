import { Tag } from 'pages/home/subPages/interfaces';
import { useState, useCallback, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { TagContext, TagModalState } from 'utils';

const TagProvider = ({ children }: { children: ReactNode }) => {
  const [tagModal, setTagModal] = useState<TagModalState | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [tagStack, setTagStack] = useState<Tag[]>([]);
  const { t } = useTranslation();

  const onTagReset = useCallback(() => {
    setTagModal(null);
    setSelectedTag(null);
    setTagStack([]);
  }, []);

  const openTagEditModal = (tag: Tag) => {
    setTagModal({
      mode: 'edit',
      isOpen: true,
      tag,
      inputTagName: tag.name,
      onClose: () => closeTagModal(),
      title: t('pages.dashboard.tag.edit.title'),
    });
  };

  const openTagCreateModal = (parentTag: Tag | null) => {
    setTagModal({
      mode: 'create',
      isOpen: true,
      tag: parentTag,
      inputTagName: '',
      onClose: () => closeTagModal(),
      title: `${parentTag?.name || '모든 메모'} 태그에 하위 태그 생성하기`,
    });
  };

  const closeTagModal = useCallback(() => {
    setTagModal(null);
  }, []);

  return (
    <TagContext.Provider
      value={{
        selectedTag,
        setSelectedTag,
        tagStack,
        setTagStack,
        tagModal,
        openTagEditModal,
        closeTagModal,
        openTagCreateModal,
        onTagReset,
      }}
    >
      {children}
    </TagContext.Provider>
  );
};

export default TagProvider;
