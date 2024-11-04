import { Memo } from 'pages/home/subPages/interfaces';
import { useState, useCallback, ReactNode } from 'react';
import { MemoContext, MemoModalState } from 'utils';

const MemoProvider = ({ children }: { children: ReactNode }) => {
  const [memoModal, setMemoModal] = useState<MemoModalState | null>(null);
  const [memoEditModal, setMemoEditModal] = useState<MemoModalState | null>(null);

  const openMemoModal = (memo: Memo) => {
    setMemoModal({
      isOpen: true,
      memo,
      onClose: () => closeMemoModal(),
    });
  };

  const closeMemoModal = useCallback(() => {
    setMemoModal(null);
  }, []);

  const openMemoEditModal = (memo: Memo) => {
    setMemoEditModal({
      isOpen: true,
      memo,
      onClose: () => closeMemoEditModal(),
    });
  };

  const closeMemoEditModal = useCallback(() => {
    setMemoEditModal(null);
  }, []);

  return (
    <MemoContext.Provider
      value={{
        memoModal,
        openMemoModal,
        closeMemoModal,
        memoEditModal,
        openMemoEditModal,
        closeMemoEditModal,
      }}
    >
      {children}
    </MemoContext.Provider>
  );
};

export default MemoProvider;
