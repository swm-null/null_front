import { Tag } from 'pages/home/subPages/interfaces';
import { useState, useCallback, ReactNode } from 'react';
import { TagContext, TagModalState } from 'utils';

const TagProvider = ({ children }: { children: ReactNode }) => {
  const [tagEditModal, setTagEditModal] = useState<TagModalState | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [tagStack, setTagStack] = useState<Tag[]>([]);

  const [eventListeners] = useState(new Set<() => void>());

  const subscribeToReset = useCallback(
    (listener: () => void) => {
      eventListeners.add(listener);
    },
    [eventListeners]
  );

  const unsubscribeFromReset = useCallback(
    (listener: () => void) => {
      eventListeners.delete(listener);
    },
    [eventListeners]
  );

  const onReset = useCallback(() => {
    eventListeners.forEach((listener) => listener());
    closeTagEditModal();
  }, [eventListeners]);

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
        selectedTag,
        setSelectedTag,
        tagStack,
        setTagStack,
        tagEditModal,
        openTagEditModal,
        closeTagEditModal,
        subscribeToReset,
        unsubscribeFromReset,
        onReset,
      }}
    >
      {children}
    </TagContext.Provider>
  );
};

export default TagProvider;
