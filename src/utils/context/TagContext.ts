import { Tag } from 'pages/home/subPages/interfaces';
import { createContext } from 'react';

export type TagModalState = {
  isOpen: boolean;
  tag: Tag;
  onClose: () => void;
};

interface TagContextType {
  tagEditModal: TagModalState | null;
  openTagEditModal: (tag: Tag) => void;
  closeTagEditModal: () => void;
  subscribeToReset: (listener: () => void) => () => void;
  onReset: () => void;
}

export const TagContext = createContext<TagContextType>({
  tagEditModal: null,
  openTagEditModal: (_: Tag) => {},
  closeTagEditModal: () => {},
  subscribeToReset: () => () => {},
  onReset: () => {},
});
