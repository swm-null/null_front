import { Dispatch, SetStateAction, useRef } from 'react';
import { Breadcrumbs } from '@mui/material';
import { RightIcon } from 'assets/icons';
import { Tag } from 'pages/home/subPages/interfaces';
import { TagPathButton } from './TagPathButton';
import { SortToggle } from './SortToggle';
import { SortOption } from 'pages/home/subPages/types';
import { useClickWithoutDrag } from 'pages/hooks';
import { UneditableTagList } from 'pages/home/subPages/components/tag/UneditableTagList';
import { useHorizontalScroll } from 'pages/home/subPages/hooks';

interface CurrentTagPathProps {
  allTagText: string;
  tagStack: Tag[];
  setTagStack: Dispatch<SetStateAction<Tag[]>>;
  tags: Tag[];
  handleTagOrAllTagsClick: (tag: Tag | null) => void;
  handleChildTagClick: (tag: Tag) => void;
  sortOption: SortOption;
  setSortOption: (sortOption: SortOption) => void;
  invalidCharsPattern: RegExp;
}

const CurrentTagPath = ({
  allTagText,
  tagStack,
  setTagStack,
  tags,
  handleTagOrAllTagsClick,
  handleChildTagClick,
  sortOption,
  setSortOption,
  invalidCharsPattern,
}: CurrentTagPathProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { onDragStart, onDragMove, onDragEnd } = useHorizontalScroll({ scrollRef });

  const createTagClickHandler = (tag: Tag) => {
    return useClickWithoutDrag(() => handleChildTagClick(tag));
  };

  const handleAllTagsClick = () => {
    setTagStack([]);
    handleTagOrAllTagsClick(null);
  };

  const handleMiddleTagClick = (index: number) => {
    const newStack = tagStack.slice(0, index + 1);
    setTagStack(newStack);
    handleTagOrAllTagsClick(newStack[index]);
  };

  return (
    <div className="flex flex-col w-full">
      <Breadcrumbs
        className="px-4"
        separator={<RightIcon />}
        aria-label="breadcrumb"
      >
        <TagPathButton
          key="all"
          text={allTagText}
          invalidCharsPattern={invalidCharsPattern}
          onClick={handleAllTagsClick}
        />
        {tagStack.map((tag, index) => (
          <TagPathButton
            key={tag.id}
            text={tag.name}
            invalidCharsPattern={invalidCharsPattern}
            onClick={
              index !== tagStack.length - 1
                ? () => handleMiddleTagClick(index)
                : undefined
            }
          />
        ))}
      </Breadcrumbs>

      <div className="flex flex-row flex-1 p-4 pb-2 gap-2">
        <UneditableTagList
          tags={tags}
          scrollRef={scrollRef}
          createTagClickHandler={createTagClickHandler}
          invalidCharsPattern={invalidCharsPattern}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
        />
        <div className="ml-auto">
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

export default CurrentTagPath;
