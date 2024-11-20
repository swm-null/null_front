import {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
  ChangeEvent,
} from 'react';
import { RecordingContext } from 'utils/contexts';

export const useRecordingManager = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const { isValidFileType } = useContext(RecordingContext);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async (startVisualizer: (stream: MediaStream) => void) => {
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
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
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

  const handleAudioFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (isValidFileType(files[0])) {
        const blob = new Blob([files[0]], { type: files[0].type });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioBlob(blob);
      }
    }
  }, []);

  const handleDelete = (resetVisualizer: () => void) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingTime(0);
    resetVisualizer();
  };

  return {
    isRecording,
    audioUrl,
    audioBlob,
    audioRef,
    recordingTime,
    handleAudioFileChange,
    startRecording,
    stopRecording,
    handleDelete,
  };
};

export default useRecordingManager;
