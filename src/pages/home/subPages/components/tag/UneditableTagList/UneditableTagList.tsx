import { UneditableTag } from 'pages/home/subPages/components';
import { Tag } from 'pages/home/subPages/interfaces';
import { LegacyRef } from 'react';

interface UneditableTagListProps {
  tags: Tag[];
  scrollRef: LegacyRef<HTMLDivElement>;
  createTagClickHandler: (tag: Tag) => {
    handleMouseDown: (e: React.MouseEvent) => void;
    handleMouseMove: (e: React.MouseEvent) => void;
    handleClick: () => void;
  };
  onDragStart: (e: React.MouseEvent) => void;
  onDragMove: (e: React.MouseEvent) => void;
  onDragEnd: (e: React.MouseEvent) => void;
  invalidCharsPattern: RegExp;
}

export const UneditableTagList = ({
  tags,
  scrollRef,
  createTagClickHandler,
  invalidCharsPattern,
  onDragStart,
  onDragMove,
  onDragEnd,
}: UneditableTagListProps) => {
  return (
    <div
      ref={scrollRef}
      className="flex flex-1 overflow-x-scroll no-scrollbar gap-1"
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
    >
      {tags.map((tag, index) => {
        const { handleMouseDown, handleMouseMove, handleClick } =
          createTagClickHandler(tag);
        return (
          <UneditableTag
            key={index}
            className="h-[27px] text-[12px]"
            text={`#${tag.name}`}
            color="peach1-transparent"
            fontColor="brown2"
            border={10}
            shadow
            invalidCharsPattern={invalidCharsPattern}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
          />
        );
      })}
    </div>
  );
};

export default UneditableTagList;
