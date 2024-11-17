import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { MemoText } from './MemoText';
import { ImageSlider } from './ImageSlider';
import { useImageList } from 'pages/home/subPages/hooks';
import { AudioPlayer } from 'react-audio-player-component';
import { CloseIcon } from 'assets/icons';

const ImageMemoText = ({
  imageUrls,
  voiceUrl,
  removeImageUrl,
  removeVoiceUrl,
  handleImageFilesChange,
  textColor,
  message,
  metadata,
  setMessage,
  editable,
  trackHeight = 96,
}: {
  imageUrls: string[];
  voiceUrl: string | null;
  removeImageUrl?: (index: number) => void;
  removeVoiceUrl?: () => void;
  message: string;
  metadata: string | null;
  textColor?: string;
  handleImageFilesChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setMessage?: (newMessage: string) => void;
  editable?: boolean;
  trackHeight?: number;
}) => {
  const { removeAllImage, handlePaste, getInputProps, getRootProps } =
    useImageList();

  useEffect(() => {
    return () => {
      removeAllImage();
    };
  }, []);

  const [width, setWidth] = useState(400);
  const [scaledWidth, setScaledWidth] = useState(0);
  const [scaledHeight, setScaledHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 30rem)');
    const updateWidth = () => setWidth(mediaQuery.matches ? 240 : 300);
    mediaQuery.addEventListener('change', updateWidth);

    updateWidth();
    return () => mediaQuery.removeEventListener('change', updateWidth);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const scale = width / 400;
      const newWidth = 400 + 16;
      const newHeight = trackHeight * (1 / scale) + 16;
      setScaledWidth(newWidth);
      setScaledHeight(newHeight);
    }
  }, [width, trackHeight]);

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
            {(imageUrls.length !== 0 || voiceUrl) && (
              <div
                className="xsm:float-left mr-4 mb-1 h-fit"
                style={{
                  width: scaledWidth * (width / 400),
                  height: scaledHeight * (width / 400),
                }}
              >
                <ImageSlider
                  imageUrls={imageUrls}
                  removeImageUrl={removeImageUrl}
                  handleImageFilesChange={handleImageFilesChange}
                  editable={editable}
                />
                {voiceUrl && (
                  <div
                    ref={containerRef}
                    className="p-2 bg-[#e8e1d9] rounded-2xl"
                    style={{
                      width: scaledWidth,
                      height: scaledHeight,
                      transform: `scale(${(width - 16) / 400})`,
                      transformOrigin: 'top left',
                    }}
                  >
                    <AudioPlayer
                      src={voiceUrl}
                      width={400}
                      trackHeight={trackHeight}
                      barWidth={3}
                      gap={1}
                      visualise
                      backgroundColor="#e8e1d9"
                      barColor="#8b7e74"
                      barPlayedColor="#F4CDB1"
                      skipDuration={2}
                      showVolumeControl
                      showLoopOption
                    />
                    {editable && (
                      <div
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md cursor-pointer"
                        onClick={removeVoiceUrl}
                      >
                        <CloseIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                )}
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
