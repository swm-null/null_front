import { CloseIcon } from 'assets/icons';
import { RecordingControls } from 'pages/home/subPages/components';

interface MediaListProps {
  images: string[];
  removeImage: (index: number) => void;
  audioBlobs: Blob[];
  removeAudio: () => void;
}

const MediaList = ({
  images,
  removeImage,
  audioBlobs,
  removeAudio,
}: MediaListProps) => {
  if (images.length === 0 && audioBlobs.length === 0) return null;

  return (
    <div className="w-full flex gap-5 overflow-x-auto no-scrollbar">
      {audioBlobs.length > 0 && (
        <div className="relative flex h-24 gap-3 flex-shrink-0">
          <RecordingControls audioUrl={URL.createObjectURL(audioBlobs[0])} />
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
