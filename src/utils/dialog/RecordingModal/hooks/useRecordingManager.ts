import { useState, useRef, useEffect } from 'react';

export const useRecordingManager = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const analyzeAudio = async (
    audioBlob: Blob,
    setAudioWaveform: (waveform: number[]) => void
  ) => {
    const audioContext = new AudioContext();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const channelData = audioBuffer.getChannelData(0);

    const samples = 64;
    const blockSize = Math.floor(channelData.length / samples);
    const waveform = [];

    for (let i = 0; i < samples; i++) {
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        const idx = i * blockSize + j;
        if (idx < channelData.length) {
          sum += Math.abs(channelData[idx]);
        }
      }
      const normalizedValue = (sum / blockSize) * 8000;
      waveform.push(Math.min(100, normalizedValue));
    }

    setAudioWaveform(waveform);
  };

  const startRecording = async (
    setAudioWaveform: (waveform: number[]) => void,
    startVisualizer: (stream: MediaStream) => void
  ) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setAudioBlob(blob);
      analyzeAudio(blob, setAudioWaveform);
    };

    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    startVisualizer(stream);
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = (animationFrameRef: React.RefObject<number>) => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDelete = (resetVisualizer: () => void) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingTime(0);
    resetVisualizer();
  };

  return {
    isRecording,
    audioUrl,
    audioBlob,
    isPlaying,
    recordingTime,
    audioRef,
    startRecording,
    stopRecording,
    togglePlayback,
    handleDelete,
    setIsPlaying,
  };
};

export default useRecordingManager;
