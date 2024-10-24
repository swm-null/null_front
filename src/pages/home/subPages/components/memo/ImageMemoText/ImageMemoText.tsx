import { ImageSlider } from './ImageSlider';
import { MemoText } from './MemoText';

const ImageMemoText = ({
  imageUrls,
  textColor,
  message,
  setMessage,
  editable,
}: {
  imageUrls: string[] | null;
  message: string;
  textColor?: string;
  setMessage: (newMessage: string) => void;
  editable?: boolean;
}) => {
  return (
    <div className="flex mb-auto flex-col xsm:flex-row w-full flex-1 gap-5 xsm:gap-9 flex-wrap">
      <ImageSlider image_urls={imageUrls} editable={editable} />
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
  );
};

export default ImageMemoText;
