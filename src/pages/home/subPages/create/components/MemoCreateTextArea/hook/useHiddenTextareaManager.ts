import { useEffect, useRef, useState } from 'react';

const useHiddenTextareaManager = (
  value: string,
  images?: string[],
  audio?: string | null
) => {
  const hiddenTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMultiline, setIsMultiline] = useState(false);

  useEffect(() => {
    if (hiddenTextareaRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(hiddenTextareaRef.current).lineHeight
      );
      const maxLines = Math.floor(
        hiddenTextareaRef.current.clientHeight / lineHeight
      );
      setIsMultiline(
        maxLines > 1 ||
          (images && images.length >= 1) ||
          (audio && audio.length >= 1) ||
          false
      );
    }
  }, [value, images, audio]);

  return { hiddenTextareaRef, isMultiline };
};

export default useHiddenTextareaManager;
