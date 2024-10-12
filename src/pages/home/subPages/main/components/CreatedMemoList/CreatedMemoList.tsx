import { useEffect, useRef } from 'react';
import { Memo } from 'pages/home/subPages/interfaces';
import { CreatedMemoCard } from './CreatedMemoCard';

const CreatedMemoList = ({
  memos,
  softDeleteMemo,
  softRevertMemo,
  fetchNextPage,
}: {
  memos: Memo[];
  softDeleteMemo?: (memoId: string) => void;
  softRevertMemo?: (memo: Memo) => void;
  fetchNextPage: () => void;
}) => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [observerRef.current, fetchNextPage]);

  return (
    <div className="flex flex-col gap-3">
      {memos.map((memo) => (
        <CreatedMemoCard
          key={memo.id}
          memo={memo}
          softDeleteMemo={softDeleteMemo}
          softRevertMemo={softRevertMemo}
        />
      ))}
      <div ref={observerRef} />
    </div>
  );
};

export default CreatedMemoList;
