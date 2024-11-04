import { useRef, useCallback, MouseEvent } from 'react';

const useClickWithoutDrag = (onClickAction: () => void) => {
  const isDragging = useRef(false);
  const startX = useRef(0);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    isDragging.current = false;
    startX.current = e.clientX;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (Math.abs(e.clientX - startX.current) > 5) {
      isDragging.current = true;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (!isDragging.current) {
      onClickAction();
    }
    isDragging.current = false;
  }, [onClickAction]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleClick,
  };
};

export default useClickWithoutDrag;
