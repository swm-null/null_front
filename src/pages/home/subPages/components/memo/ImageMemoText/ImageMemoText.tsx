import { useContext, useEffect } from 'react';
import { ImageSlider } from './ImageSlider';
import { MemoText } from './MemoText';
import { ImageListContext } from 'utils';

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
  const { removeAllImage, handlePaste, getInputProps, getRootProps } =
    useContext(ImageListContext);

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
