import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { createContext } from 'react';

export type MemoModalState = {
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
