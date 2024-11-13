import { Tag } from 'pages/home/subPages/interfaces';
import { createContext, Dispatch, SetStateAction } from 'react';

export type TagModalState = {
  isOpen: boolean;
  tag: Tag;
  onClose: () => void;
};

interface TagContextType {
  selectedTag: Tag | null;
  setSelectedTag: Dispatch<SetStateAction<Tag | null>>;
  tagStack: Tag[];
  setTagStack: Dispatch<SetStateAction<Tag[]>>;
  tagEditModal: TagModalState | null;
  openTagEditModal: (tag: Tag) => void;
  closeTagEditModal: () => void;
  subscribeToReset: (listener: () => void) => void;
  unsubscribeFromReset: (listener: () => void) => void;
  onReset: () => void;
}

export const TagContext = createContext<TagContextType>({
  selectedTag: null,
  setSelectedTag: (_: SetStateAction<Tag | null>) => {},
  tagStack: [],
  setTagStack: (_: SetStateAction<Tag[]>) => {},
  tagEditModal: null,
  openTagEditModal: (_: Tag) => {},
  closeTagEditModal: () => {},
  subscribeToReset: () => {},
  unsubscribeFromReset: () => {},
  onReset: () => {},
});
