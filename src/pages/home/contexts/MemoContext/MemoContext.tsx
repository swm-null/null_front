import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { createContext } from 'react';
import { useState, useCallback, ReactNode } from 'react';

type MemoModalState = {
  isOpen: boolean;
  memo: Memo;
  onClose: () => void;
  mode: 'create' | 'edit';
  tag: Tag | null;
};

type MemoContextType = {
  memoModal: MemoModalState | null;
  openMemoEditModal: (memo: Memo) => void;
  openMemoCreateModal: (memo: Memo, tag: Tag) => void;
  closeMemoModal: () => void;
};

export const MemoContext = createContext<MemoContextType>({
  memoModal: null,
  openMemoEditModal: (_: Memo) => {},
  openMemoCreateModal: (_: Memo, __: Tag) => {},
  closeMemoModal: () => {},
});

export const MemoProvider = ({ children }: { children: ReactNode }) => {
  const [memoModal, setMemoModal] = useState<MemoModalState | null>(null);

  const openMemoEditModal = (memo: Memo) => {
    setMemoModal({
      isOpen: true,
      memo,
      onClose: () => closeMemoModal(),
      mode: 'edit',
      tag: null,
    });
  };

  const openMemoCreateModal = (memo: Memo, tag: Tag) => {
    setMemoModal({
      isOpen: true,
      memo,
      onClose: () => closeMemoModal(),
      mode: 'create',
      tag,
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
