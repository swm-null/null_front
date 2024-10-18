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

  const isValidFileType = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    return allowedTypes.includes(file.type);
  };

  return (
    <ImageListContext.Provider
      value={{ images, addImage, removeImage, removeAllImage, isValidFileType }}
    >
      {children}
    </ImageListContext.Provider>
  );
};

export default ImageListProvider;
