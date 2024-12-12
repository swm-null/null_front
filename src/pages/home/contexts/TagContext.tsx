import { Tag } from 'pages/home/subPages/interfaces';
import { createContext, Dispatch, SetStateAction } from 'react';
import { useState, useCallback, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type TagModalState = {
  mode: 'create' | 'edit';
  isOpen: boolean;
  tag: Tag | null;
  inputTagName: string;
  onClose: () => void;
  title: string;
};

interface TagContextType {
  selectedTag: Tag | null;
  setSelectedTag: Dispatch<SetStateAction<Tag | null>>;
  tagStack: Tag[];
  setTagStack: Dispatch<SetStateAction<Tag[]>>;
  tagModal: TagModalState | null;
  openTagEditModal: (tag: Tag) => void;
  openTagCreateModal: (parentTag: Tag | null) => void;
  closeTagModal: () => void;
  onTagReset: () => void;
}

export const TagContext = createContext<TagContextType>({
  selectedTag: null,
  setSelectedTag: (_: SetStateAction<Tag | null>) => {},
  tagStack: [],
  setTagStack: (_: SetStateAction<Tag[]>) => {},
  tagModal: null,
  openTagEditModal: (_: Tag) => {},
  openTagCreateModal: (_: Tag | null) => {},
  closeTagModal: () => {},
  onTagReset: () => {},
});

export const TagProvider = ({ children }: { children: ReactNode }) => {
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
