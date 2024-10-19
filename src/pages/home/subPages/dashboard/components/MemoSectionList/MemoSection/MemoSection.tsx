import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { MemoSectionHeader } from './MemoSectionHeader';
import { UneditableMemo } from 'pages/home/subPages/components';
import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from 'pages/home/subPages/hooks';
import useChildTagMemos from './hook/useChildTagMemosManager';
import { SortOption } from '../../../interfaces';

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
  const memosDivRef = useRef<HTMLDivElement | null>(null);

  const [headerWidth, setHeaderWidth] = useState<number>(0);

  const { memos, fetchNextPage } = useChildTagMemos(
    tag?.id || null,
    isLinked,
    sortOption
  );

  useIntersectionObserver(observerRef, {
    callback: (entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    },
    options: { threshold: 0.5 },
  });

  useEffect(() => {
    const checkSize = () => {
      if (memosDivRef.current) {
        setHeaderWidth(memosDivRef.current.offsetWidth || 0);
      }
    };
    checkSize();

    window.addEventListener('resize', checkSize);
    return () => {
      window.removeEventListener('resize', checkSize);
    };
  }, [memos]);

  if (!memos.length) return <></>;

  return (
    <div className="flex flex-col w-auto max-w-full rounded-2xl overflow-hidden flex-shrink-0 bg-[#FFF6E366] border border-black border-opacity-10 shadow-custom backdrop-blur-lg">
      {!isLinked && (
        <MemoSectionHeader
          tag={tag!}
          width={headerWidth}
          childTags={childTags}
          handleTagClick={handleTagClick}
        />
      )}
      <div
        ref={memosDivRef}
        className="flex-1 h-full overflow-scroll no-scrollbar py-4 px-[0.87rem] border-t border-black border-opacity-10 w-fit"
      >
        <div className="flex flex-col flex-1 gap-[0.4rem] w-fit">
          {(memos || []).map(
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
