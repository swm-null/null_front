import { Tag } from 'pages/home/subPages/interfaces';
import { LegacyRef } from 'react';
import TagItem from './TagItem';

interface UneditableTagListProps {
  tags: Tag[];
  scrollRef: LegacyRef<HTMLDivElement>;
  invalidCharsPattern: RegExp;
  onChildTagClick: (tag: Tag) => void;
  onDragStart: (e: React.MouseEvent) => void;
  onDragMove: (e: React.MouseEvent) => void;
  onDragEnd: (e: React.MouseEvent) => void;
}

export const UneditableTagList = ({
  tags,
  scrollRef,
  invalidCharsPattern,
  onChildTagClick,
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
      {tags.map((tag, index) => (
        <TagItem
          key={index}
          tag={tag}
          onChildTagClick={onChildTagClick}
          invalidCharsPattern={invalidCharsPattern}
        />
      ))}
    </div>
  );
};

export default UneditableTagList;
