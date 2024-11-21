import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { MemoText } from './MemoText';
import { ImageSlider } from './ImageSlider';
import { CloseIcon } from 'assets/icons';
import { useTranslation } from 'react-i18next';
import { MemoContext } from 'utils';

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
  handlePaste,
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
  handlePaste: (e: React.ClipboardEvent) => void;
}) => {
  const { memoModal } = useContext(MemoContext);
  const isCreateMode = memoModal?.mode === 'create';

  const [isReady, setIsReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      setIsReady(true);
    }
  }, []);

  const { t } = useTranslation();

  return (
    <>
      <div className="flex mb-auto flex-col xsm:flex-row w-full flex-1 gap-5 xsm:gap-9 flex-wrap">
        {message || imageUrls.length !== 0 || voiceUrl || editable ? (
          <div className="w-full relative overflow-visible">
            {(imageUrls.length !== 0 || voiceUrl) && (
              <div className="flex flex-col xsm:float-left mr-4 mb-1 h-fit gap-3">
                {imageUrls.length !== 0 && (
                  <div className="h-fit w-fit">
                    <ImageSlider
                      imageUrls={imageUrls}
                      removeImageUrl={removeImageUrl}
                      handleImageFilesChange={handleImageFilesChange}
                      editable={editable}
                    />
                  </div>
                )}
                {voiceUrl && (
                  <audio ref={audioRef} src={voiceUrl} preload="metadata" />
                )}
                {isReady && voiceUrl && (
                  <div className="relative xs:w-60 w-full max-w-72">
                    <AudioPlayer
                      src={voiceUrl}
                      customAdditionalControls={[]}
                      showJumpControls={false}
                      timeFormat="mm:ss"
                      showDownloadProgress
                      autoPlay={false}
                      layout="stacked"
                      customProgressBarSection={[
                        RHAP_UI.CURRENT_TIME,
                        RHAP_UI.PROGRESS_BAR,
                        RHAP_UI.DURATION,
                      ]}
                      customControlsSection={[
                        RHAP_UI.MAIN_CONTROLS,
                        RHAP_UI.VOLUME_CONTROLS,
                      ]}
                      volume={0.5}
                    />
                    {editable && (
                      <div
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md cursor-pointer"
                        onClick={removeVoiceUrl}
                      >
                        <CloseIcon className="w-5 h-5" />
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
              placeholder={
                isCreateMode
                  ? t('memo.createContentPlaceholder')
                  : t('memo.editContentPlaceholder')
              }
              onPaste={handlePaste}
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
