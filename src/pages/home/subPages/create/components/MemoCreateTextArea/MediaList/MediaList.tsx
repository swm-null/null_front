import { CloseIcon } from 'assets/icons';
import { AudioPlayer } from 'react-audio-player-component';

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
        <div className="relative flex gap-3 flex-shrink-0">
          <AudioPlayer
            src={audioUrl}
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
