import { useEffect, useState, RefObject } from 'react';

interface UseHorizontalScrollProps {
  scrollRef: RefObject<HTMLDivElement>;
}

export const useHorizontalScroll = ({ scrollRef }: UseHorizontalScrollProps) => {
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);

  const onDragStart = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;

    e.preventDefault();
    setIsDrag(true);
    setStartX(e.pageX + scrollRef.current.scrollLeft);
  };

  const onDragEnd = () => {
    setIsDrag(false);
  };

  const onDragMove = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;

    if (isDrag && scrollRef.current) {
      scrollRef.current.scrollLeft = startX - e.pageX;
    }
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
