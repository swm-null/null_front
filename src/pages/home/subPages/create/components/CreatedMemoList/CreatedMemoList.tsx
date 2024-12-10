import { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import { Memo } from 'pages/home/subPages/interfaces';
import { CreatedMemoCard } from './CreatedMemoCard';
import { useIntersectionObserver } from 'pages/home/subPages/hooks';
import { BottomNavContext } from 'utils';

const CreatedMemoList = forwardRef<
  HTMLDivElement,
  { memos: Memo[]; fetchNextPage: () => void }
>(({ memos, fetchNextPage }, ref) => {
  const { isSmallScreen, bottomNavHeight } = useContext(BottomNavContext);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [scrollOpacity, setScrollOpacity] = useState({ top: 1, bottom: 1 });

  const updateScrollOpacity = () => {
    const scrollElement = typeof ref === 'function' ? null : ref?.current;

    if (scrollElement) {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const topOpacity = scrollTop > 0 ? 0.1 : 1;
      const bottomOpacity = scrollTop + clientHeight < scrollHeight ? 0.1 : 1;
      setScrollOpacity({ top: topOpacity, bottom: bottomOpacity });
    }
  };

  useEffect(() => {
    const scrollElement = (ref as React.RefObject<HTMLDivElement>)?.current;
    if (scrollElement) {
      updateScrollOpacity();
      scrollElement.addEventListener('scroll', updateScrollOpacity);
      return () => scrollElement.removeEventListener('scroll', updateScrollOpacity);
    }
  }, []);

  useIntersectionObserver(observerRef, {
    callback: (entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    },
    options: { threshold: 0.5 },
  });

  return (
    <div
      ref={ref}
      className={`flex flex-col flex-1 max-w-[740px] w-full self-center overflow-scroll no-scrollbar
        p-4 pt-0 ${isSmallScreen ? '' : 'mb-10 mx-20'}`}
      style={{
        paddingBottom: isSmallScreen ? bottomNavHeight + 24 : 0,
        maskImage: `linear-gradient(to bottom, rgba(0, 0, 0, ${scrollOpacity.top}) 0.1%, rgba(0, 0, 0, 1) 5%, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, ${scrollOpacity.bottom}) 99.9%)`,
        WebkitMaskImage: `linear-gradient(to bottom, rgba(0, 0, 0, ${scrollOpacity.top}) 0.1%, rgba(0, 0, 0, 1) 5%, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, ${scrollOpacity.bottom}) 99.9%)`,
      }}
    >
      <div className="flex flex-col gap-3">
        {memos.map((memo) => (
          <CreatedMemoCard key={JSON.stringify(memo)} memo={memo} />
        ))}
      </div>
      <div ref={observerRef} className="min-h-[1px] bg-transparent" />
    </div>
  );
});

export default CreatedMemoList;
