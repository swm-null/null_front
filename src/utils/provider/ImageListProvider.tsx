import React, { ChangeEvent, ReactNode, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        if (isValidFileType(file)) addImage(file);
      });
    },
    [addImage, isValidFileType]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
  });

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      Array.from(items).forEach((item) => {
        if (item.type.startsWith('image/')) {
          const blob = item.getAsFile();
          if (blob && isValidFileType(blob)) addImage(blob);
        }
      });
    },
    [addImage, isValidFileType]
  );

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        if (isValidFileType(file)) {
          addImage(file);
        }
      });
    }
  };

  const handleAddImageButtonClick = () => {
    const inputFile = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (inputFile) inputFile.click();
  };

  return (
    <ImageListContext.Provider
      value={{
        images,
        removeImage,
        removeAllImage,
        getRootProps,
        getInputProps,
        handlePaste,
        handleImageFileChange,
        handleAddImageButtonClick,
      }}
    >
      {children}
    </ImageListContext.Provider>
  );
};

export default ImageListProvider;
