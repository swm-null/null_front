import { useEffect, useRef, useState } from 'react';
import AudioPlayer, {
  InterfacePlacementKey,
  PlayListUI,
  ProgressUI,
  RepeatType,
} from 'react-modern-audio-player';

interface AudioVisualizerProps {
  audioUrl: string | null;
  isRecording: {
    isRecording: boolean;
    visualizerData: number[];
  } | null;
  recordingTime: number;
}

const AudioVisualizer = ({
  audioUrl,
  isRecording,
  recordingTime,
}: AudioVisualizerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    setContainerWidth(containerRef.current?.offsetWidth || 0);
  }, [containerRef]);

  const playList = [
    {
      src: audioUrl || '',
      id: 1,
    },
  ];

  const activeUI = {
    playButton: true,
    playList: false as PlayListUI,
    prevNnext: false,
    volume: false,
    volumeSlider: false,
    repeatType: false,
    trackTime: true,
    trackInfo: false,
    artwork: false,
    progress: 'waveform' as ProgressUI,
  };

  const interfacePlacement: Partial<Record<InterfacePlacementKey, string>> = {
    progress: 'row1-2',
    trackTimeCurrent: 'row2-1',
    trackTimeDuration: 'row2-3',
    playButton: 'row2-2',
  };

  useEffect(() => {
    setContainerWidth(containerRef.current?.offsetWidth || 0);

    const playerContainers = [
      document.getElementsByClassName('interface-grid')[0],
      document.getElementsByClassName('rm-audio-player-provider')[0],
    ].filter(Boolean);

    if (playerContainers) {
      console.log(playerContainers);
      playerContainers.map((playerContainer) => {
        (playerContainer as HTMLElement).style.backgroundColor = 'transparent';
      });
    }
  }, [audioUrl]);

  return (
    <div className="w-full flex flex-1 min-h-24 bg-[#e8e1d9] rounded-2xl p-3 flex-shrink-0">
      <div ref={containerRef} className="w-full h-full flex items-center">
        {isRecording?.isRecording ? (
          <>
            {isRecording.visualizerData.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-[#8b7e74] rounded-full mx-[1px]"
                style={{ height: `${value}%` }}
              />
            ))}
            <div className="flex items-center gap-2">
              {isRecording?.isRecording && (
                <span className="text-red-500 animate-pulse">●</span>
              )}
              <span className="text-[#8b7e74]">{formatTime(recordingTime)}</span>
            </div>
          </>
        ) : audioUrl ? (
          <div className="flex flex-col items-start gap-2 w-full">
            <span className="text-[#8b7e74] absolute top-0 left-2">
              {formatTime(recordingTime)}
            </span>
            <AudioPlayer
              key={'modal'}
              playList={playList}
              activeUI={activeUI}
              audioInitialState={{
                curPlayId: 1,
                isPlaying: false,
                repeatType: 'ONE' as RepeatType,
              }}
              placement={{
                interface: {
                  templateArea: interfacePlacement as Record<string, string>,
                },
              }}
              rootContainerProps={{
                width: `${containerWidth}px`,
              }}
            />
          </div>
        ) : (
          <div className="w-full"></div>
        )}
      </div>
    </div>
  );
};

export default AudioVisualizer;
