import { useEffect, useRef, useState } from 'react';

const useHiddenTextareaManager = (value: string, images: File[]) => {
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
      setIsMultiline(maxLines > 1 || images.length >= 1);
    }
  }, [value, images]);

  return { hiddenTextareaRef, isMultiline };
};

export default useHiddenTextareaManager;
