import { useContext, useEffect } from 'react';
import { ImageSlider } from './ImageSlider';
import { MemoText } from './MemoText';
import { ImageListContext } from 'utils';
import { useDropzone } from 'react-dropzone';

const ImageMemoText = ({
  imageUrls,
  removeImageUrl,
  textColor,
  message,
  setMessage,
  editable,
}: {
  imageUrls: string[];
  removeImageUrl?: (index: number) => void;
  message: string;
  textColor?: string;
  setMessage: (newMessage: string) => void;
  editable?: boolean;
}) => {
  const { addImage, isValidFileType, removeAllImage } = useContext(ImageListContext);

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    Array.from(items).forEach((item) => {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        if (blob && isValidFileType(blob)) addImage(blob);
      }
    });
  };

  const onDrop = (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(isValidFileType);
    if (validFiles.length > 0) {
      validFiles.forEach((file) => {
        console.log(file);
        addImage(file);
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
  });

  useEffect(() => {
    return () => {
      removeAllImage();
    };
  }, []);

  return (
    <>
      <input {...getInputProps()} />
      <div
        className="flex mb-auto flex-col xsm:flex-row w-full flex-1 gap-5 xsm:gap-9 flex-wrap"
        {...getRootProps()}
        onPaste={handlePaste}
      >
        <ImageSlider
          imageUrls={imageUrls}
          removeImageUrl={removeImageUrl}
          editable={editable}
        />
        {message || editable ? (
          <MemoText
            textColor={textColor}
            message={message}
            setMessage={setMessage}
            editable={editable}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default ImageMemoText;
