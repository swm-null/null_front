import { useContext, useRef } from 'react';
import { Memo } from 'pages/home/subPages/interfaces';
import { CreatedMemoCard } from './CreatedMemoCard';
import { useIntersectionObserver } from 'pages/home/subPages/hooks';
import { BottomNavContext } from 'utils';

const CreatedMemoList = ({
  memos,
  fetchNextPage,
}: {
  memos: Memo[];
  fetchNextPage: () => void;
}) => {
  const { isSmallScreen, bottomNavHeight } = useContext(BottomNavContext);
  const observerRef = useRef<HTMLDivElement | null>(null);

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
      className="flex flex-col p-4 pt-0"
      style={{ paddingBottom: isSmallScreen ? bottomNavHeight + 24 : 0 }}
    >
      <div className="flex flex-col gap-3">
        {memos.map((memo) => (
          <CreatedMemoCard key={JSON.stringify(memo)} memo={memo} />
        ))}
      </div>
      <div ref={observerRef} className="min-h-[1px] bg-transparent" />
    </div>
  );
};

export default CreatedMemoList;
