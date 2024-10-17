import { createContext } from 'react';

interface ImageListContextType {
  images: File[];
  addImage: (image: File) => void;
  removeImage: (index: number) => void;
  removeAllImage: () => void;
}

const ImageListContext = createContext<ImageListContextType>({
  images: [],
  addImage: (_: File) => {},
  removeImage: (_: number) => {},
  removeAllImage: () => {},
});

export default ImageListContext;
