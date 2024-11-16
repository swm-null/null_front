import { ChangeEvent, useEffect } from 'react';
import { MemoText } from './MemoText';
import { ImageSlider } from './ImageSlider';
import { useImageList } from 'pages/home/subPages/hooks';
import { AudioPlayer } from 'react-audio-player-component';

const ImageMemoText = ({
  imageUrls,
  voiceUrl,
  removeImageUrl,
  handleImageFilesChange,
  textColor,
  message,
  metadata,
  setMessage,
  editable,
}: {
  imageUrls: string[];
  voiceUrl: string | null;
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
        {message || imageUrls.length !== 0 || voiceUrl || editable ? (
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
            {voiceUrl && (
              <AudioPlayer
                src={voiceUrl}
                width={300}
                trackHeight={96}
                barWidth={2}
                gap={1}
                visualise
                backgroundColor="#e8e1d9"
                barColor="#8b7e74"
                barPlayedColor="#F4CDB1"
                skipDuration={2}
                minimal
                showLoopOption
                showVolumeControl
                hideSeekBar
                hideSeekKnobWhenPlaying
              />
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
