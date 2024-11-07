import { useState, useRef, useEffect } from 'react';
import { Modal } from '@mui/material';
import { AudioVisualizer } from './AudioVisualizer';
import { RecordButton, PlaybackButton, ResetButton } from './buttons';
import { ModalActionButtons } from './ModalActionButtons';

interface RecordingModalProps {
  open: boolean;
  onClose: () => void;
  onSend?: (audioBlob: Blob) => void;
}

const RecordingModal = ({ open, onClose, onSend }: RecordingModalProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [visualizerData, setVisualizerData] = useState<number[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [audioWaveform, setAudioWaveform] = useState<number[]>([]);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
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

  const startRecording = async () => {
    try {
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
        analyzeAudio(blob);
      };

      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      startVisualizer(stream);
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
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

  const stopRecording = () => {
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

  const handleDelete = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingTime(0);
    setVisualizerData([]);
    setAudioWaveform([]);
  };

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (audioBlob && onSend) {
      onSend(audioBlob);
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex items-center justify-center"
    >
      <div className="bg-[#f5f0ea] p-6 rounded-3xl shadow-lg w-[480px] relative">
        <div className="flex w-full flex-col items-center gap-4">
          <div className="w-full flex items-center gap-4">
            {!audioUrl ? (
              <RecordButton
                isRecording={isRecording}
                onToggleRecording={isRecording ? stopRecording : startRecording}
              />
            ) : (
              <PlaybackButton
                isPlaying={isPlaying}
                onTogglePlayback={togglePlayback}
              />
            )}
            <AudioVisualizer
              isRecording={isRecording}
              recordingTime={recordingTime}
              visualizerData={visualizerData}
              audioWaveform={audioWaveform}
            />
            {audioUrl && <ResetButton onReset={handleDelete} />}
          </div>
          <audio
            ref={audioRef}
            src={audioUrl || undefined}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
        <ModalActionButtons onSubmit={handleSend} onClose={onClose} />
      </div>
    </Modal>
  );
};

export default RecordingModal;
