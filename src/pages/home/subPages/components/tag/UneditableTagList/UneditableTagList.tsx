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
  /**
   * tag의 색상을 설정
   * default: peach2
   */
  color?: 'white' | 'peach0' | 'peach1' | 'peach2' | 'cream0';
  /**
   * tag의 border opacity를 숫자로 전달
   * 0 -> 0%
   * 5 -> 5%
   * 10 -> 10%
   * default: 10
   */
  border?: 0 | 5 | 10;
  invalidCharsPattern: RegExp;
  onChildTagClick?: (tag: Tag) => void;
}

export const UneditableTagList = ({
  tags,
  invalidCharsPattern,
  size = 'medium',
  color = 'peach2',
  border = 10,
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
          color={color}
          border={border}
          onChildTagClick={onChildTagClick}
          invalidCharsPattern={invalidCharsPattern}
        />
      ))}
    </div>
  );
};

export default UneditableTagList;
