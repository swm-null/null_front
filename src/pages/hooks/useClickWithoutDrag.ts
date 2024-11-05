import { useRef, useCallback, MouseEvent } from 'react';

const useClickWithoutDrag = (onClickAction: (e?: MouseEvent) => void) => {
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    isDragging.current = false;
    startX.current = e.clientX;
    startY.current = e.clientY;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (
      Math.abs(e.clientX - startX.current) > 5 ||
      Math.abs(e.clientY - startY.current) > 5
    ) {
      isDragging.current = true;
    }
  }, []);

  const handleClick = useCallback(
    (e?: MouseEvent) => {
      if (!isDragging.current) {
        onClickAction(e);
      }
      isDragging.current = false;
    },
    [onClickAction]
  );

  return {
    handleMouseDown,
    handleMouseMove,
    handleClick,
  };
};

export default useClickWithoutDrag;
