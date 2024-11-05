import { Memo } from 'pages/home/subPages/interfaces';
import { createContext } from 'react';

export type MemoModalState = {
  isOpen: boolean;
  memo: Memo;
  onClose: () => void;
};

type MemoContextType = {
  memoModal: MemoModalState | null;
  openMemoModal: (memo: Memo) => void;
  closeMemoModal: () => void;
  memoEditModal: MemoModalState | null;
  openMemoEditModal: (memo: Memo) => void;
  closeMemoEditModal: () => void;
};

export const MemoContext = createContext<MemoContextType>({
  memoModal: null,
  openMemoModal: (_: Memo) => {},
  closeMemoModal: () => {},
  memoEditModal: null,
  openMemoEditModal: (_: Memo) => {},
  closeMemoEditModal: () => {},
});
