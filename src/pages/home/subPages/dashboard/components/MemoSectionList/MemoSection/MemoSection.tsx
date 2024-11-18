import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { MemoSectionHeader } from './MemoSectionHeader';
import { useContext, useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from 'pages/home/subPages/hooks';
import { useChildTagMemosManager } from '../hook';
import { SortOption } from 'pages/home/subPages/types';
import { SummaryMemoWithoutDrag } from '../SummaryMemoWithoutDrag';
import { Fab } from '@mui/material';
import { AddIcon } from 'assets/icons';
import { MemoContext } from 'utils';

interface MemoSectionProps {
  tag: Tag;
  childTags: Tag[];
  isLinked?: boolean;
  isLeaf?: boolean;
  sortOption: SortOption;
  handleTagClick: () => void;
  handleChildTagClick: (childTag: Tag) => void;
}

const MemoSection = ({
  tag,
  childTags,
  isLinked = false,
  isLeaf = false,
  sortOption,
  handleTagClick,
  handleChildTagClick,
}: MemoSectionProps) => {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [updateKey, setUpdateKey] = useState(0);

  const { openMemoCreateModal } = useContext(MemoContext);

  const { memos, fetchNextPage } = useChildTagMemosManager(
    tag.id,
    isLinked,
    sortOption
  );

  const haveLinkedMemos = isLinked && !memos.length;

  const handleCreateMemo = () => {
    const memo = {
      id: 'temp',
      tags: [],
      image_urls: [],
      voice_urls: [],
      metadata: '',
      content: '',
      created_at: null,
      updated_at: null,
    } as Memo;
    openMemoCreateModal(memo, tag);
  };

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
      className="relative flex flex-col rounded-2xl overflow-hidden flex-shrink-0 bg-[#FFF6E366] border 
      border-black border-opacity-10 bg-clip-padding shadow-custom backdrop-blur-lg"
    >
      <MemoSectionHeader
        tag={tag}
        isLinked={isLinked}
        isLeaf={isLeaf}
        childTags={isLinked ? [] : childTags}
        {...(!isLinked && {
          handleTagClick: handleTagClick,
        })}
        handleChildTagClick={handleChildTagClick}
      />
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
      <Fab
        style={{
          position: 'absolute',
          width: 42,
          height: 42,
          background: '#FFF6E3',
        }}
        className="bottom-4 right-4 shadow-md z-50"
        onClick={handleCreateMemo}
      >
        <AddIcon className="text-brown2" />
      </Fab>
    </div>
  );
};

export default MemoSection;
