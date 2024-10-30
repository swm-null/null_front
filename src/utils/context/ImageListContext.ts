import { ChangeEvent, createContext } from 'react';

interface ImageListContextType {
  images: File[];
  removeImage: (index: number) => void;
  removeAllImage: () => void;
  getRootProps: () => any;
  getInputProps: () => any;
  handlePaste: (e: React.ClipboardEvent) => void;
  handleImageFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleAddImageButtonClick: () => void;
}

const ImageListContext = createContext<ImageListContextType>({
  images: [],
  removeImage: (_: number) => {},
  removeAllImage: () => {},
  getRootProps: () => ({}),
  getInputProps: () => ({}),
  handlePaste: (_: React.ClipboardEvent) => {},
  handleImageFileChange: (_: ChangeEvent<HTMLInputElement>) => {},
  handleAddImageButtonClick: () => {},
});

export default ImageListContext;
