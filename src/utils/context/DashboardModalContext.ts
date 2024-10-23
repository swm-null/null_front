import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { createContext } from 'react';

export type TagModalState = {
  isOpen: boolean;
  tag: Tag;
  onClose: () => void;
};

export type MemoModalState = {
  isOpen: boolean;
  memo: Memo;
  onClose: () => void;
};

type DashboardModalContextType = {
  tagEditModal: TagModalState | null;
  memoEditModal: MemoModalState | null;
  openTagEditModal: (Tag: Tag) => void;
  openMemoEditModal: (memo: Memo) => void;
  closeTagEditModal: () => void;
  closeMemoEditModal: () => void;
};

const DashboardModalContext = createContext<DashboardModalContextType>({
  tagEditModal: null,
  memoEditModal: null,
  openTagEditModal: (_: Tag) => {},
  openMemoEditModal: (_: Memo) => {},
  closeTagEditModal: () => {},
  closeMemoEditModal: () => {},
});

export default DashboardModalContext;
