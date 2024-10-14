import { useRef } from 'react';
import { Memo } from 'pages/home/subPages/interfaces';
import { CreatedMemoCard } from './CreatedMemoCard';
import { useIntersectionObserver } from 'pages/home/subPages/hooks';

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

  useIntersectionObserver(observerRef, fetchNextPage);

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
