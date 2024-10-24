import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { MemoSectionHeader } from './MemoSectionHeader';
import { UneditableMemo } from 'pages/home/subPages/components';
import { useRef } from 'react';
import { useIntersectionObserver } from 'pages/home/subPages/hooks';
import { useChildTagMemosManager } from '../hook';
import { SortOption } from 'pages/home/subPages/types';

interface MemoSectionProps {
  tag: Tag | null;
  childTags: Tag[];
  isLinked: boolean;
  sortOption: SortOption;
  handleTagClick: () => void;
  handleMemoClick: (memo: Memo, index: number) => void;
}

const MemoSection = ({
  tag,
  childTags,
  isLinked,
  sortOption,
  handleTagClick,
  handleMemoClick,
}: MemoSectionProps) => {
  const observerRef = useRef<HTMLDivElement | null>(null);

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

  if (haveLinkedMemos) return <></>;

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden flex-shrink-0 bg-[#FFF6E366] border border-black border-opacity-10 shadow-custom backdrop-blur-lg">
      {!isLinked && (
        <MemoSectionHeader
          tag={tag!}
          childTags={childTags}
          handleTagClick={handleTagClick}
        />
      )}
      <div className="flex-1 h-full overflow-scroll no-scrollbar py-4 px-[0.87rem] border-t border-black border-opacity-10">
        <div className="flex flex-col flex-1 gap-[0.4rem] w-60 ">
          {memos.map(
            (memo, index) =>
              memo && (
                <UneditableMemo
                  key={memo?.id}
                  memo={memo}
                  shadow
                  border
                  onClick={() => handleMemoClick(memo, index)}
                />
              )
          )}
          <div ref={observerRef} />
        </div>
      </div>
    </div>
  );
};

export default MemoSection;
