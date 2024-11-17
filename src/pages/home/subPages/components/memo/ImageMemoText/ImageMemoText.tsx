import { ChangeEvent, useEffect, useRef, useState } from 'react';
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
  trackHeight = 96,
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
  trackHeight?: number;
}) => {
  const { removeAllImage, handlePaste, getInputProps, getRootProps } =
    useImageList();

  const [width, setWidth] = useState(400);
  const [scale, setScale] = useState(1);
  const [scaledWidth, setScaledWidth] = useState(0);
  const [scaledHeight, setScaledHeight] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 30rem)');
    const updateWidth = () => setWidth(mediaQuery.matches ? 240 : 300);
    mediaQuery.addEventListener('change', updateWidth);

    updateWidth();
    return () => {
      mediaQuery.removeEventListener('change', updateWidth);
      removeAllImage();
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const newScale = (width - 16) / 400;
      setScale(newScale);
      const newWidth = 429;
      const newHeight = trackHeight * (1 / newScale) + 29;
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
                className="flex flex-col xsm:float-left mr-4 mb-1 h-fit gap-3"
                style={{
                  width:
                    scaledWidth * (width / 400) ||
                    imageSliderRef.current?.clientWidth ||
                    0,
                  height:
                    scaledHeight * (width / 400) +
                    (imageSliderRef.current?.clientHeight || 0),
                }}
              >
                {imageUrls.length !== 0 && (
                  <div ref={imageSliderRef} className="h-fit w-fit">
                    <ImageSlider
                      imageUrls={imageUrls}
                      removeImageUrl={removeImageUrl}
                      handleImageFilesChange={handleImageFilesChange}
                      editable={editable}
                    />
                  </div>
                )}
                {voiceUrl && (
                  <div
                    ref={containerRef}
                    className="p-2 bg-[#e8e1d9] rounded-2xl"
                    style={{
                      width: scaledWidth,
                      height: scaledHeight,
                      transform: `scale(${scale})`,
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
