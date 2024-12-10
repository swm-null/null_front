import { useRef, useEffect, useState } from 'react';

const useHorizontalScrollOpacity = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollOpacity, setScrollOpacity] = useState({ left: 1, right: 1 });

  const updateScrollOpacity = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const leftOpacity = scrollLeft > 0 ? 0.1 : 1;
      const rightOpacity = scrollLeft + clientWidth < scrollWidth ? 0.1 : 1;
      setScrollOpacity({ left: leftOpacity, right: rightOpacity });
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      updateScrollOpacity();
      scrollElement.addEventListener('scroll', updateScrollOpacity);
      return () => scrollElement.removeEventListener('scroll', updateScrollOpacity);
    }
  }, [scrollRef.current?.scrollWidth]);

  return { scrollRef, scrollOpacity };
};

export default useHorizontalScrollOpacity;
