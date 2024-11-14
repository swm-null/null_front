import React, { ChangeEvent, useCallback, useContext, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { AlertContext } from 'utils';

const useImageList = () => {
  const ALLOWED_IMAGE_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const { t } = useTranslation();
  const { alert } = useContext(AlertContext);

  const convertImageToObjectUrl = (image: File) => URL.createObjectURL(image);

  const addImage = useCallback((image: File) => {
    setImages((prev) => [...prev, image]);
    setImageUrls((prev) => [...prev, convertImageToObjectUrl(image)]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const removeAllImage = useCallback(() => {
    setImages([]);
    setImageUrls([]);
  }, []);

  const isValidFileType = (file: File) => {
    return ALLOWED_IMAGE_FILE_TYPES.includes(file.type);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      let haveInvalidFile = false;

      acceptedFiles.forEach((file) => {
        if (isValidFileType(file)) {
          addImage(file);
        } else {
          haveInvalidFile = true;
        }
      });

      if (haveInvalidFile) {
        alert(t('utils.file.invalidImageType'));
      }
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
      let haveInvalidFile = false;

      Array.from(items).forEach((item) => {
        if (item.type.startsWith('image/')) {
          const blob = item.getAsFile();
          if (blob && isValidFileType(blob)) {
            addImage(blob);
          } else {
            haveInvalidFile = true;
          }
        }
      });

      if (haveInvalidFile) {
        alert(t('utils.file.invalidImageType'));
      }
    },
    [addImage, isValidFileType]
  );

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const images = e.target.files;
    if (images && images.length > 0) {
      if (isValidFileType(images[0])) {
        setImages([images[0]]);
        setImageUrls([convertImageToObjectUrl(images[0])]);
      } else {
        alert(t('utils.file.invalidImageType'));
      }
    }
  };

  const handleImageFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      let haveInvalidFile = false;

      Array.from(files).forEach((file) => {
        if (isValidFileType(file)) {
          addImage(file);
        } else {
          haveInvalidFile = true;
        }
      });

      if (haveInvalidFile) {
        alert(t('utils.file.invalidImageType'));
      }
    }
  };

  const handleAddImageButtonClick = () => {
    const inputFile = document.querySelector(
      '#image-file-input'
    ) as HTMLInputElement;
    if (inputFile) inputFile.click();
  };

  return {
    images,
    imageUrls,
    ALLOWED_IMAGE_FILE_TYPES,
    removeImage,
    removeAllImage,
    getRootProps,
    getInputProps,
    handlePaste,
    handleImageFileChange,
    handleImageFilesChange,
    handleAddImageButtonClick,
  };
};

export default useImageList;
