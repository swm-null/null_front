import { Memo } from 'pages/home/subPages/interfaces';
import { useState, useCallback, ReactNode } from 'react';
import { MemoContext, MemoModalState } from 'utils';

const MemoProvider = ({ children }: { children: ReactNode }) => {
  const [memoEditModal, setMemoEditModal] = useState<MemoModalState | null>(null);

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
