import { Tag } from 'pages/home/subPages/interfaces';
import { createContext, Dispatch, SetStateAction } from 'react';

export type TagModalState = {
  mode: 'create' | 'edit';
  isOpen: boolean;
  tag: Tag | null;
  inputTagName: string;
  onClose: () => void;
  title: string;
};

interface TagContextType {
  selectedTag: Tag | null;
  setSelectedTag: Dispatch<SetStateAction<Tag | null>>;
  tagStack: Tag[];
  setTagStack: Dispatch<SetStateAction<Tag[]>>;
  tagModal: TagModalState | null;
  openTagEditModal: (tag: Tag) => void;
  openTagCreateModal: (parentTag: Tag | null) => void;
  closeTagModal: () => void;
  subscribeToReset: (listener: () => void) => void;
  unsubscribeFromReset: (listener: () => void) => void;
  onReset: () => void;
}

export const TagContext = createContext<TagContextType>({
  selectedTag: null,
  setSelectedTag: (_: SetStateAction<Tag | null>) => {},
  tagStack: [],
  setTagStack: (_: SetStateAction<Tag[]>) => {},
  tagModal: null,
  openTagEditModal: (_: Tag) => {},
  openTagCreateModal: (_: Tag | null) => {},
  closeTagModal: () => {},
  subscribeToReset: () => {},
  unsubscribeFromReset: () => {},
  onReset: () => {},
});
