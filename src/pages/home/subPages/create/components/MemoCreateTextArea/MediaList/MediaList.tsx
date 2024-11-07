import { CloseIcon } from 'assets/icons';
import { RecordingControls } from 'pages/home/subPages/components';
import { useEffect } from 'react';
import { useRef, useState } from 'react';

interface MediaListProps {
  images: File[];
  removeImage: (index: number) => void;
  audioBlob: Blob | null;
  audioWaveform: number[];
}

const MediaList = ({
  images,
  removeImage,
  audioBlob,
  audioWaveform,
}: MediaListProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      const context = new AudioContext();
      const reader = new FileReader();

      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        const duration = Math.floor(audioBuffer.duration);

        setRecordingTime(duration);
      };

      reader.readAsArrayBuffer(audioBlob);

      return () => {
        URL.revokeObjectURL(url);
        context.close();
      };
    }
  }, [audioBlob]);
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

  if (images.length === 0 && !audioBlob) return null;

  return (
    <div className="w-full flex gap-5 overflow-x-auto no-scrollbar">
      {audioBlob && (
        <div className="flex h-24 w-fit gap-3 flex-shrink-0">
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            onError={(e) => {
              console.error('Audio error:', e);
              setIsPlaying(false);
            }}
          />
          <RecordingControls
            audioUrl={URL.createObjectURL(audioBlob)}
            isPlaying={isPlaying}
            recordingTime={recordingTime}
            audioWaveform={audioWaveform}
            togglePlayback={togglePlayback}
          />
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
