import { ChangeEvent, useEffect } from 'react';
import { MemoText } from './MemoText';
import { ImageSlider } from './ImageSlider';
import { useImageList } from 'pages/home/subPages/hooks';

const ImageMemoText = ({
  imageUrls,
  removeImageUrl,
  handleImageFilesChange,
  textColor,
  message,
  metadata,
  setMessage,
  editable,
}: {
  imageUrls: string[];
  removeImageUrl?: (index: number) => void;
  message: string;
  metadata: string | null;
  textColor?: string;
  handleImageFilesChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setMessage?: (newMessage: string) => void;
  editable?: boolean;
}) => {
  const { removeAllImage, handlePaste, getInputProps, getRootProps } =
    useImageList();

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
        {message || imageUrls.length !== 0 || editable ? (
          <div className="w-full overflow-hidden">
            {imageUrls.length !== 0 && (
              <div className="xsm:float-left mr-4 mb-1">
                <ImageSlider
                  imageUrls={imageUrls}
                  removeImageUrl={removeImageUrl}
                  handleImageFilesChange={handleImageFilesChange}
                  editable={editable}
                />
              </div>
            )}
            <MemoText
              textColor={textColor}
              message={message}
              metadata={metadata}
              setMessage={setMessage}
              editable={editable}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default ImageMemoText;
