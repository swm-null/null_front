import { useRef, useEffect, useState } from 'react';

const useVerticalScrollOpacity = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollOpacity, setScrollOpacity] = useState({ top: 1, bottom: 1 });

  const updateScrollOpacity = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const topOpacity = scrollTop > 0 ? 0.1 : 1;
      const bottomOpacity = scrollTop + clientHeight < scrollHeight ? 0.1 : 1;
      setScrollOpacity({ top: topOpacity, bottom: bottomOpacity });
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      updateScrollOpacity();
      scrollElement.addEventListener('scroll', updateScrollOpacity);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', updateScrollOpacity);
      }
    };
  }, [scrollRef.current?.scrollHeight]);

  return { scrollRef, scrollOpacity };
};

export default useVerticalScrollOpacity;
