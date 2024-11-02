import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { AlertContext, ImageListContext } from 'utils';

const ImageListProvider = ({ children }: { children: ReactNode }) => {
  const ALLOWED_IMAGE_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  const [images, setImages] = useState<File[]>([]);
  const { t } = useTranslation();
  const { alert } = useContext(AlertContext);

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
    const files = e.target.files;
    if (files && files.length > 0) {
      if (isValidFileType(files[0])) {
        setImages([files[0]]);
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
      'input[type="file"]'
    ) as HTMLInputElement;
    if (inputFile) inputFile.click();
  };

  return (
    <ImageListContext.Provider
      value={{
        images,
        ALLOWED_IMAGE_FILE_TYPES,
        removeImage,
        removeAllImage,
        getRootProps,
        getInputProps,
        handlePaste,
        handleImageFileChange,
        handleImageFilesChange,
        handleAddImageButtonClick,
      }}
    >
      {children}
    </ImageListContext.Provider>
  );
};

export default ImageListProvider;
