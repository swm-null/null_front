import { useState, useRef, useEffect } from 'react';

export const useVisualizerManager = () => {
  const [visualizerData, setVisualizerData] = useState<number[]>([]);
  const [audioWaveform, setAudioWaveform] = useState<number[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const startVisualizer = (stream: MediaStream) => {
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);
    analyserRef.current.fftSize = 128;

    const updateVisualizer = () => {
      if (!analyserRef.current) return;
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);

      const normalizedData = Array.from(dataArray).map(
        (value) => (value / 255) * 100
      );
      setVisualizerData(normalizedData);
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    };

    updateVisualizer();
  };

  const analyzeAudio = async (audioBlob: Blob) => {
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

  const resetVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setVisualizerData([]);
    setAudioWaveform([]);
  };

  return {
    visualizerData,
    audioWaveform,
    startVisualizer,
    analyzeAudio,
    setVisualizerData,
    setAudioWaveform,
    resetVisualizer,
    animationFrameRef,
  };
};

export default useVisualizerManager;
