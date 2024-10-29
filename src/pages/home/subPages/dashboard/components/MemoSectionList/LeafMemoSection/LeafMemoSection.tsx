import { useRef } from 'react';
import { useChildTagMemosManager } from '../hook';
import { useIntersectionObserver } from 'pages/home/subPages/hooks';
import { Tag } from 'pages/home/subPages/interfaces';
import { SortOption } from 'pages/home/subPages/types';
import { MemosList } from 'pages/home/subPages/components';
import { UneditableMemoWithoutDrag } from '../UneditableMemoWithoutDrag';

const SINGLE_MEMO_LIMIT = 20;

const LeafMemoSection = ({
  parentTag,
  sortOption,
}: {
  parentTag: Tag | null;
  sortOption: SortOption;
}) => {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { memos, fetchNextPage } = useChildTagMemosManager(
    parentTag?.id || null,
    true,
    sortOption,
    SINGLE_MEMO_LIMIT
  );

  useIntersectionObserver(observerRef, {
    callback: (entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    },
    options: { threshold: 0.5 },
  });

  // FIXME: 메모가 없을때 보여야하는 화면
  if (!memos.length) return <></>;

  return (
    <div
      key={parentTag?.id}
      className="flex flex-1 bg-[#FFF6E366] m-4 mt-2 rounded-2xl shadow-custom backdrop-blur-lg"
    >
      <MemosList>
        {memos.map((memo) => (
          <UneditableMemoWithoutDrag key={memo.id} memo={memo} shadow border />
        ))}
        <div ref={observerRef} className="min-h-[1px] bg-transparent" />
      </MemosList>
    </div>
  );
};

export default LeafMemoSection;
