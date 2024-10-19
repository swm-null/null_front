import { useEffect, useRef, useState } from 'react';

const useHiddenTextareaManager = (value: string, images: File[]) => {
  const hiddenTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMultiline, setIsMultiline] = useState(false);
  const [hiddenTextareaWidth, setHiddenTextareaWidth] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (hiddenTextareaRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(hiddenTextareaRef.current).lineHeight
      );
      const maxLines = Math.floor(
        hiddenTextareaRef.current.clientHeight / lineHeight
      );
      setIsMultiline(maxLines > 1 || images.length >= 1);
      setHiddenTextareaWidth(hiddenTextareaRef.current.clientWidth);
    }
  }, [value, images]);

  return { hiddenTextareaRef, isMultiline, hiddenTextareaWidth };
};

export default useHiddenTextareaManager;
