import { Tag } from 'pages/home/subPages/interfaces';
import { useContext, useEffect, useRef, useState } from 'react';
import TagItem from './TagItem';
import { useHorizontalScroll } from 'pages/home/subPages/hooks';
import { useNavigate } from 'react-router-dom';
import { AlertContext, TagContext } from 'utils';
import { getAncestorTags, isGetTagsResponse } from 'api';

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
  borderOpacity?: 0 | 5 | 10;
  invalidCharsPattern: RegExp;
  beforeChildTagClick?: () => void;
}

const UneditableTagList = ({
  tags,
  invalidCharsPattern,
  size = 'medium',
  color = 'peach2',
  borderOpacity = 10,
  beforeChildTagClick,
}: UneditableTagListProps) => {
  const { setSelectedTag, setTagStack } = useContext(TagContext);
  const { alert } = useContext(AlertContext);
  const navigate = useNavigate();

  const scrollRef = useRef<HTMLDivElement>(null);
  const { onDragStart, onDragMove, onDragEnd } = useHorizontalScroll({ scrollRef });
  const [scrollOpacity, setScrollOpacity] = useState({ left: 1, right: 1 });

  const updateScrollOpacity = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const leftOpacity = scrollLeft > 0 ? 0.1 : 1;
      const rightOpacity = scrollLeft + clientWidth < scrollWidth ? 0.1 : 1;
      setScrollOpacity({ left: leftOpacity, right: rightOpacity });
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      updateScrollOpacity();
      scrollElement.addEventListener('scroll', updateScrollOpacity);
      return () => scrollElement.removeEventListener('scroll', updateScrollOpacity);
    }
  }, []);

  const onChildTagClick = async (tag: Tag) => {
    try {
      const response = await getAncestorTags(tag.id);

      if (isGetTagsResponse(response)) {
        beforeChildTagClick && beforeChildTagClick();
        setSelectedTag(response.tags[response.tags.length - 1]);
        setTagStack(response.tags);

        const splitedUrl = window.location.href.split('/');
        if (splitedUrl[splitedUrl.length - 1] === 'dashboard') {
          history.pushState(
            {
              tagStack: response.tags,
            },
            '',
            window.location.href
          );
        } else {
          navigate('/dashboard');
        }
      } else if (response.exceptionCode === '1002') {
        alert('태그를 생성하고, 메모를 배치 중이니, 잠시만 기다려 주세요.');
      }
    } catch {}
  };

  return (
    <div className="relative flex flex-1 w-full">
      <div
        ref={scrollRef}
        className="flex flex-none w-fit max-w-full overflow-x-scroll no-scrollbar gap-1"
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        style={{
          maskImage: `linear-gradient(to right, rgba(0, 0, 0, ${scrollOpacity.left}) 5%, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, ${scrollOpacity.right}) 95%)`,
          WebkitMaskImage: `linear-gradient(to right, rgba(0, 0, 0, ${scrollOpacity.left}) 5%, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, ${scrollOpacity.right}) 95%)`,
        }}
      >
        {tags.map((tag, index) => (
          <TagItem
            key={index}
            tag={tag}
            size={size}
            color={color}
            borderOpacity={borderOpacity}
            onChildTagClick={onChildTagClick}
            invalidCharsPattern={invalidCharsPattern}
          />
        ))}
      </div>
    </div>
  );
};

export default UneditableTagList;
