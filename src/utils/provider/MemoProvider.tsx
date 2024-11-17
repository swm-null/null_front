import { Memo } from 'pages/home/subPages/interfaces';
import { useState, useCallback, ReactNode } from 'react';
import { MemoContext, MemoModalState } from 'utils';

const MemoProvider = ({ children }: { children: ReactNode }) => {
  const [memoModal, setMemoModal] = useState<MemoModalState | null>(null);

  const openMemoEditModal = (memo: Memo) => {
    setMemoModal({
      isOpen: true,
      memo,
      onClose: () => closeMemoModal(),
      mode: 'edit',
    });
  };

  const openMemoCreateModal = (memo: Memo) => {
    setMemoModal({
      isOpen: true,
      memo,
      onClose: () => closeMemoModal(),
      mode: 'create',
    });
  };

  const closeMemoModal = useCallback(() => {
    setMemoModal(null);
  }, []);

  return (
    <MemoContext.Provider
      value={{
        memoModal,
        openMemoEditModal,
        openMemoCreateModal,
        closeMemoModal,
      }}
    >
      {children}
    </MemoContext.Provider>
  );
};

export default MemoProvider;
