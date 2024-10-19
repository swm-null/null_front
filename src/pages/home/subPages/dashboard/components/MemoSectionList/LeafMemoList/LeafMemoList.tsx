import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { SortOption } from '../../../interfaces';
import { useRef } from 'react';
import { useChildTagMemosManager } from '../hook';
import { useIntersectionObserver } from 'pages/home/subPages/hooks';
import { MemosList, UneditableMemo } from 'pages/home/subPages/components';

const SINGLE_MEMO_LIMIT = 20;

const LeafMemoList = ({
  parentTag,
  sortOption,
  handleMemoClick,
}: {
  parentTag: Tag | null;
  sortOption: SortOption;
  handleMemoClick: (memo: Memo, tag: Tag | null, index: number) => void;
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
        {memos.map((memo, index) => (
          <UneditableMemo
            key={memo.id}
            memo={memo}
            shadow
            border
            onClick={() =>
              handleMemoClick(memo, parentTag ? parentTag : null, index)
            }
          />
        ))}
        <div ref={observerRef} />
      </MemosList>
    </div>
  );
};

export default LeafMemoList;
