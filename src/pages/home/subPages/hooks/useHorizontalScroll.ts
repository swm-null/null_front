import { useEffect, useState, RefObject } from 'react';

interface UseHorizontalScrollProps {
  scrollRef: RefObject<HTMLDivElement>;
}

const useHorizontalScroll = ({ scrollRef }: UseHorizontalScrollProps) => {
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);

  const onDragStart = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;

    const target = e.target as Node;
    if (!scrollRef.current.contains(target)) return;

    e.stopPropagation();
    setIsDrag(true);
    setStartX(e.pageX + scrollRef.current.scrollLeft);
  };

  const onDragMove = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;

    e.stopPropagation();
    if (isDrag && scrollRef.current) {
      scrollRef.current.scrollLeft = startX - e.pageX;
    }
  };

  const onDragEnd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDrag(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [scrollRef?.current]);

  return {
    onDragStart,
    onDragMove,
    onDragEnd,
  };
};

export default useHorizontalScroll;
