import { Tag } from 'pages/home/subPages/interfaces';
import { MemoSectionHeader } from './MemoSectionHeader';
import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from 'pages/home/subPages/hooks';
import { useChildTagMemosManager } from '../hook';
import { SortOption } from 'pages/home/subPages/types';
import { SummaryMemoWithoutDrag } from '../SummaryMemoWithoutDrag';

interface MemoSectionProps {
  tag: Tag | null;
  childTags: Tag[];
  isLinked: boolean;
  sortOption: SortOption;
  handleTagClick: () => void;
  handleChildTagClick: (childTag: Tag) => void;
}

const MemoSection = ({
  tag,
  childTags,
  isLinked,
  sortOption,
  handleTagClick,
  handleChildTagClick,
}: MemoSectionProps) => {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [updateKey, setUpdateKey] = useState(0);

  const { memos, fetchNextPage } = useChildTagMemosManager(
    tag?.id || null,
    isLinked,
    sortOption
  );

  const haveLinkedMemos = isLinked && !memos.length;

  useIntersectionObserver(observerRef, {
    callback: (entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    },
    options: { threshold: 0.5 },
  });

  useEffect(() => {
    setUpdateKey((prev) => prev + 1);
  }, [memos]);

  if (haveLinkedMemos) return <></>;

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden flex-shrink-0 bg-[#FFF6E366] border 
      border-black border-opacity-10 bg-clip-padding shadow-custom backdrop-blur-lg"
    >
      {!isLinked && (
        <MemoSectionHeader
          tag={tag!}
          childTags={childTags}
          handleTagClick={handleTagClick}
          handleChildTagClick={handleChildTagClick}
        />
      )}
      <div className="flex-1 h-full overflow-scroll no-scrollbar py-4 px-[0.87rem] border-t border-black border-opacity-10">
        <div key={updateKey} className="flex flex-col flex-1 gap-[0.4rem] w-60 ">
          {memos.map(
            (memo) =>
              memo && (
                <SummaryMemoWithoutDrag key={memo?.id} memo={memo} shadow border />
              )
          )}
        </div>
        <div ref={observerRef} className="min-h-[1px] bg-transparent" />
      </div>
    </div>
  );
};

export default MemoSection;
