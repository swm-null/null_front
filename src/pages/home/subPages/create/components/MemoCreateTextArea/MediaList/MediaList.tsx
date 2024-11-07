import { CloseIcon } from 'assets/icons';
import { RecordingControls } from 'pages/home/subPages/components';
import { useEffect } from 'react';
import { useRef, useState } from 'react';

interface MediaListProps {
  images: File[];
  removeImage: (index: number) => void;
  audioBlobs: Blob[];
  audioWaveform: number[];
  removeAudio: () => void;
}

const MediaList = ({
  images,
  removeImage,
  audioBlobs,
  audioWaveform,
  removeAudio,
}: MediaListProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');

  useEffect(() => {
    if (audioBlobs.length > 0) {
      const url = URL.createObjectURL(audioBlobs[0]);
      setAudioUrl(url);

      const context = new AudioContext();
      const reader = new FileReader();

      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        const duration = Math.floor(audioBuffer.duration);

        setRecordingTime(duration);
      };

      reader.readAsArrayBuffer(audioBlobs[0]);

      return () => {
        URL.revokeObjectURL(url);
        context.close();
      };
    }
  }, [audioBlobs]);
  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error('Audio playback failed:', error);
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  };

  if (images.length === 0 && audioBlobs.length === 0) return null;

  return (
    <div className="w-full flex gap-5 overflow-x-auto no-scrollbar">
      {audioBlobs.length > 0 && (
        <div className="relative flex h-24 gap-3 flex-shrink-0">
          <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
          <RecordingControls
            audioUrl={URL.createObjectURL(audioBlobs[0])}
            isPlaying={isPlaying}
            recordingTime={recordingTime}
            audioWaveform={audioWaveform}
            togglePlayback={togglePlayback}
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
            src={URL.createObjectURL(image)}
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
