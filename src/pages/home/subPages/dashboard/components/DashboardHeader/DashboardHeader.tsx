import { useContext, useEffect, useRef, useState } from 'react';
import { Breadcrumbs, CircularProgress } from '@mui/material';
import { AddIcon, RightIcon } from 'assets/icons';
import { Tag } from 'pages/home/subPages/interfaces';
import { TagPathButton } from './TagPathButton';
import { SortToggle } from './SortToggle';
import { SortOption } from 'pages/home/subPages/types';
import { UneditableTagList } from 'pages/home/subPages/components';
import { DashboardResetContext, SSEContext, TagContext } from 'utils';
import { useHorizontalScroll } from 'pages/home/subPages/hooks';

interface DashboardHeaderProps {
  allTagText: string;
  tags: Tag[];
  handleTagOrAllTagsClick: (tag: Tag | null) => void;
  sortOption: SortOption;
  setSortOption: (sortOption: SortOption) => void;
  invalidCharsPattern: RegExp;
}

const DashboardHeader = ({
  allTagText,
  tags,
  handleTagOrAllTagsClick,
  sortOption,
  setSortOption,
  invalidCharsPattern,
}: DashboardHeaderProps) => {
  const { selectedTag, onTagReset, tagStack, setTagStack, openTagCreateModal } =
    useContext(TagContext);
  const { onReset } = useContext(DashboardResetContext);
  const { batchingMemoCount } = useContext(SSEContext);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { onDragStart, onDragMove, onDragEnd } = useHorizontalScroll({ scrollRef });

  const handleAllTagsClick = () => {
    onTagReset();
    onReset();
    handleTagOrAllTagsClick(null);
  };

  const handleMiddleTagClick = (index: number) => {
    history.pushState(
      {
        tagStack: tagStack.slice(0, index + 1),
      },
      '',
      window.location.href
    );

    const newStack = tagStack.slice(0, index + 1);
    setTagStack(newStack);
    handleTagOrAllTagsClick(newStack[index]);
  };

  const handleCreateTag = () => {
    openTagCreateModal(selectedTag);
    try {
    } catch {}
  };

  const [isWrapped, setIsWrapped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkWrap = () => {
      if (containerRef.current) {
        const firstChild = containerRef.current.firstElementChild;
        const secondChild = containerRef.current.lastElementChild;

        if (firstChild && secondChild) {
          const isWrappedNow =
            firstChild.getBoundingClientRect().bottom !==
            secondChild.getBoundingClientRect().top;
          setIsWrapped(isWrappedNow);
        }
      }
    };

    checkWrap();
    window.addEventListener('resize', checkWrap);
    return () => window.removeEventListener('resize', checkWrap);
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full">
        <div className="flex overflow-hidden p-4">
          <div
            ref={scrollRef}
            className="flex w-full overflow-auto no-scrollbar"
            onMouseDown={onDragStart}
            onMouseMove={onDragMove}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
          >
            <Breadcrumbs
              separator={<RightIcon />}
              aria-label="breadcrumb"
              sx={{
                '& ol': {
                  flexWrap: 'nowrap',
                },
              }}
            >
              <TagPathButton
                key="all"
                tag={{ id: '@', name: allTagText }}
                onClick={handleAllTagsClick}
              />
              {tagStack.map((tag, index) => (
                <TagPathButton
                  key={tag.id}
                  tag={tag}
                  isCurrentTag={index === tagStack.length - 1}
                  onClick={() => handleMiddleTagClick(index)}
                />
              ))}
            </Breadcrumbs>
          </div>
        </div>
        {batchingMemoCount !== 0 && (
          <p className="flex flex-shrink-0 ml-auto pr-4 text-sm self-center gap-2 text-[#6A5344E6]">
            배치 중입니다
            <CircularProgress className="self-center" size={14} />
          </p>
        )}
      </div>

      <div className="flex w-full flex-wrap p-4 pb-2 gap-2" ref={containerRef}>
        <div className={`flex max-w-full gap-1 ${isWrapped ? 'pr-8' : ''}`}>
          <UneditableTagList
            tags={tags}
            size="large"
            color="cream0"
            borderOpacity={10}
            invalidCharsPattern={invalidCharsPattern}
          />
          <AddIcon
            className="text-brown2 bg-cream0 p-[7px] h-[27px] w-[27px] rounded-full cursor-pointer
              border border-black border-opacity-10 bg-clip-padding flex-shrink-0"
            onClick={handleCreateTag}
          />
        </div>
        <div className="flex ml-auto w-fit">
          <SortToggle
            height="1.6875rem"
            fontSize="0.75rem"
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
