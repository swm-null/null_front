import { createContext } from 'react';

interface ImageListContextType {
  images: File[];
  addImage: (image: File) => void;
  removeImage: (index: number) => void;
  removeAllImage: () => void;
  isValidFileType: (file: File) => boolean;
}

const ImageListContext = createContext<ImageListContextType>({
  images: [],
  addImage: (_: File) => {},
  removeImage: (_: number) => {},
  removeAllImage: () => {},
  isValidFileType: (_: File) => false,
});

export default ImageListContext;
