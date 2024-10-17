import { ReactNode, useCallback, useState } from 'react';
import { ImageListContext } from 'utils';

const ImageListProvider = ({ children }: { children: ReactNode }) => {
  const [images, setImages] = useState<File[]>([]);

  const addImage = useCallback((image: File) => {
    setImages((prev) => [...prev, image]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const removeAllImage = useCallback(() => {
    setImages([]);
  }, []);

  return (
    <ImageListContext.Provider
      value={{ images, addImage, removeImage, removeAllImage }}
    >
      {children}
    </ImageListContext.Provider>
  );
};

export default ImageListProvider;
