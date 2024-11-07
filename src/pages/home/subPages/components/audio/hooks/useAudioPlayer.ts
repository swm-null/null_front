import { useState, useEffect, useRef, useCallback } from 'react';

const useAudioPlayer = (audioUrl: string | null) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    if (!audioUrl) return;

    const context = new AudioContext();
    fetch(audioUrl)
      .then((response) => response.arrayBuffer())
      .then(async (arrayBuffer) => {
        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        setRecordingTime(Math.floor(audioBuffer.duration));
      });

    audioRef.current = new Audio(audioUrl);
    audioRef.current.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      context.close();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', () => setIsPlaying(false));
      }
    };
  }, [audioUrl]);

  return { isPlaying, recordingTime, togglePlayback };
};

export default useAudioPlayer;
