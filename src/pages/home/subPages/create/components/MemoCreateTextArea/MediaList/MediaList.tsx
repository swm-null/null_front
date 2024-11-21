import { CloseIcon } from 'assets/icons';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';

interface MediaListProps {
  images: string[];
  removeImage: (index: number) => void;
  audioUrl: string | null;
  removeAudio: () => void;
}

const MediaList = ({
  images,
  removeImage,
  audioUrl,
  removeAudio,
}: MediaListProps) => {
  if (images.length === 0 && !audioUrl) return null;

  return (
    <div className="w-full flex gap-5 overflow-x-auto no-scrollbar">
      {audioUrl && (
        <div className="relative flex gap-3 flex-shrink-0 h-24 w-60">
          <AudioPlayer
            className="bg-white shadow-none rounded-xl border"
            src={audioUrl}
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
            customControlsSection={[RHAP_UI.MAIN_CONTROLS, RHAP_UI.VOLUME_CONTROLS]}
            volume={0.5}
          />
          <div
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer"
            onClick={removeAudio}
          >
            <CloseIcon className="w-4 h-4" />
          </div>
        </div>
      )}
      {images.map((image, index) => (
        <div key={index} className="relative h-24 min-w-[7rem] flex-shrink-0">
          <img
            src={image}
            alt="Pasted content"
            className="h-full w-full object-contain rounded-lg"
          />
          <div
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer"
            onClick={() => removeImage(index)}
          >
            <CloseIcon className="w-4 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaList;
