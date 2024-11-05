import { Tag } from 'pages/home/subPages/interfaces';
import { useState, useCallback, ReactNode } from 'react';
import { TagContext, TagModalState } from 'utils';

const TagProvider = ({ children }: { children: ReactNode }) => {
  const [tagEditModal, setTagEditModal] = useState<TagModalState | null>(null);

  const openTagEditModal = (tag: Tag) => {
    setTagEditModal({
      isOpen: true,
      tag,
      onClose: () => closeTagEditModal(),
    });
  };

  const closeTagEditModal = useCallback(() => {
    setTagEditModal(null);
  }, []);

  return (
    <TagContext.Provider
      value={{
        tagEditModal,
        openTagEditModal,
        closeTagEditModal,
      }}
    >
      {children}
    </TagContext.Provider>
  );
};

export default TagProvider;
