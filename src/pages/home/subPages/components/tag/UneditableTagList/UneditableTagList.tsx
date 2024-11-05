import { Tag } from 'pages/home/subPages/interfaces';
import { useRef } from 'react';
import TagItem from './TagItem';
import { useHorizontalScroll } from 'pages/home/subPages/hooks';

interface UneditableTagListProps {
  tags: Tag[];
  /**
   * tag의 크기를 설정
   * default: large
   */
  size?: 'small' | 'medium' | 'large';
  invalidCharsPattern: RegExp;
  onChildTagClick?: (tag: Tag) => void;
}

export const UneditableTagList = ({
  tags,
  invalidCharsPattern,
  size = 'medium',
  onChildTagClick,
}: UneditableTagListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { onDragStart, onDragMove, onDragEnd } = useHorizontalScroll({ scrollRef });

  return (
    <div
      ref={scrollRef}
      className="flex flex-none w-fit max-w-full overflow-x-scroll no-scrollbar gap-1"
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
    >
      {tags.map((tag, index) => (
        <TagItem
          key={index}
          tag={tag}
          size={size}
          onChildTagClick={onChildTagClick}
          invalidCharsPattern={invalidCharsPattern}
        />
      ))}
    </div>
  );
};

export default UneditableTagList;
