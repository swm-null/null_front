import { useRef, useCallback, MouseEvent } from 'react';

const useClickWithoutDrag = (onClickAction: (e?: MouseEvent) => void) => {
  const isDragging = useRef(false);
  const startX = useRef(0);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    isDragging.current = false;
    startX.current = e.clientX;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (Math.abs(e.clientX - startX.current) > 5) {
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
