import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface MemosListProps {
  children?: ReactNode;
}

const MemosList = ({ children }: MemosListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [viewWidth, setViewWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setViewWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getColumnsCountBreakPoints = () => {
    const breakpoints: { [key: number]: number } = {};

    // 전체 화면 크기와, masonry의 크기 비율에 맞춰, breakpoint를 설정
    breakpoints[Math.floor((viewWidth / containerWidth) * 300)] = 1;
    breakpoints[Math.floor((viewWidth / containerWidth) * 600)] = 2;
    breakpoints[Math.floor((viewWidth / containerWidth) * 900)] = 3;

    return breakpoints;
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col flex-1 overflow-x-hidden mt-4"
    >
      {children ? (
        <ResponsiveMasonry
          columnsCountBreakPoints={getColumnsCountBreakPoints()}
        >
          <Masonry gutter="16px">{children}</Masonry>
        </ResponsiveMasonry>
      ) : null}
    </div>
  );
};

export default MemosList;
