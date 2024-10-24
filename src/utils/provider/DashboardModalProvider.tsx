import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { useState, useCallback, ReactNode } from 'react';
import { DashboardModalContext, MemoModalState, TagModalState } from 'utils';

const DashboardModalProvider = ({ children }: { children: ReactNode }) => {
  const [tagEditModal, setTagEditModal] = useState<TagModalState | null>(null);
  const [memoEditModal, setMemoEditModal] = useState<MemoModalState | null>(null);

  const openTagEditModal = (tag: Tag) => {
    setTagEditModal({
      isOpen: true,
      tag,
      onClose: () => closeTagEditModal(),
    });
  };

  const openMemoEditModal = (memo: Memo) => {
    setMemoEditModal({
      isOpen: true,
      memo,
      onClose: () => closeMemoEditModal(),
    });
  };

  const closeTagEditModal = useCallback(() => {
    setTagEditModal(null);
  }, []);

  const closeMemoEditModal = useCallback(() => {
    setMemoEditModal(null);
  }, []);

  return (
    <DashboardModalContext.Provider
      value={{
        tagEditModal,
        memoEditModal,
        openTagEditModal,
        openMemoEditModal,
        closeTagEditModal,
        closeMemoEditModal,
      }}
    >
      {children}
    </DashboardModalContext.Provider>
  );
};

export default DashboardModalProvider;
