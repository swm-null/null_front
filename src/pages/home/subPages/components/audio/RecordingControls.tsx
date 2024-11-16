import { useRef, useState, useEffect } from 'react';
import { AudioVisualizer } from 'utils/dialog/RecordingModal/AudioVisualizer';
import { RecordButton } from 'utils/dialog/RecordingModal/buttons';
import { useAudioPlayer, useAudioWaveform } from './hooks';
import { Skeleton } from '@mui/material';

interface RecordingControlsProps {
  audioUrl: string | null;
  recordingTime?: number;
  editable?: {
    isRecording: boolean;
    visualizerData: number[];
    handleStopRecording: () => void;
    handleStartRecording: () => void;
  };
}

const RecordingControls = ({
  audioUrl,
  recordingTime: originalRecordingTime,
  editable,
}: RecordingControlsProps) => {
  const { recordingTime } = useAudioPlayer(audioUrl);
  const [audioWaveform] = useAudioWaveform(audioUrl);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const contentWidth = contentRef.current?.offsetWidth || 0;

    if (contentWidth > containerWidth) {
      setScale(containerWidth / contentWidth);
    } else {
      setScale(1);
    }
  }, [audioUrl, recordingTime, audioWaveform]);

  if (audioUrl && audioWaveform.length <= 0) {
    return (
      <div ref={containerRef} className="flex w-full h-full">
        <div
          className={`flex h-full ${editable ? 'gap-4 w-full' : 'gap-2 min-w-fit'}`}
        >
          <Skeleton
            className="self-center"
            variant="circular"
            width={48}
            height={48}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            className="flex flex-col flex-1 min-h-24 rounded-xl"
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex w-full h-full">
      <div
        ref={contentRef}
        className={`flex h-full ${editable ? 'gap-4 w-full' : 'gap-2 min-w-fit'}`}
        style={{ transform: `scale(${scale})`, transformOrigin: 'left' }}
      >
        <RecordButton
          isRecording={editable?.isRecording || false}
          onToggleRecording={
            editable
              ? editable.isRecording
                ? editable.handleStopRecording
                : editable.handleStartRecording
              : () => {}
          }
        />
        {editable && (
          <AudioVisualizer
            isRecording={
              editable?.visualizerData && editable.visualizerData.length > 0
                ? {
                    isRecording: editable.isRecording,
                    visualizerData: editable.visualizerData,
                  }
                : null
            }
            recordingTime={
              audioUrl || !originalRecordingTime
                ? recordingTime
                : originalRecordingTime
            }
            audioWaveform={audioWaveform}
          />
        )}
      </div>
    </div>
  );
};

export default RecordingControls;
