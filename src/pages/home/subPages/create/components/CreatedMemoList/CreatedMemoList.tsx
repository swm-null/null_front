import { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { Memo } from 'pages/home/subPages/interfaces';
import { CreatedMemoCard } from './CreatedMemoCard';
import {
  useIntersectionObserver,
  useVerticalScrollOpacity,
} from 'pages/home/subPages/hooks';
import { BottomNavContext } from 'utils';

const CreatedMemoList = forwardRef<
  HTMLDivElement,
  { memos: Memo[]; fetchNextPage: () => void }
>(({ memos, fetchNextPage }, ref) => {
  const { isSmallScreen, bottomNavHeight } = useContext(BottomNavContext);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { scrollRef, scrollOpacity } = useVerticalScrollOpacity();

  const fallbackRef = useRef<HTMLDivElement>(document.createElement('div'));
  useImperativeHandle(ref, () => scrollRef.current || fallbackRef.current);

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
      ref={scrollRef}
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
