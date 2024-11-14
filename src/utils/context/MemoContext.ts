import { Memo } from 'pages/home/subPages/interfaces';
import { createContext } from 'react';

export type MemoModalState = {
  isOpen: boolean;
  memo: Memo;
  onClose: () => void;
};

type MemoContextType = {
  memoEditModal: MemoModalState | null;
  openMemoEditModal: (memo: Memo) => void;
  closeMemoEditModal: () => void;
};

export const MemoContext = createContext<MemoContextType>({
  memoEditModal: null,
  openMemoEditModal: (_: Memo) => {},
  closeMemoEditModal: () => {},
});
