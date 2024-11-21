import { Tag } from 'pages/home/subPages/interfaces';
import { useContext, useRef } from 'react';
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

export const UneditableTagList = ({
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
          borderOpacity={borderOpacity}
          onChildTagClick={onChildTagClick}
          invalidCharsPattern={invalidCharsPattern}
        />
      ))}
    </div>
  );
};

export default UneditableTagList;
