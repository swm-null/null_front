import { UneditableTag } from 'pages/home/subPages/components';
import { Tag } from 'pages/home/subPages/interfaces';
import { useClickWithoutDrag } from 'pages/hooks';

const TagItem = ({
  tag,
  size = 'medium',
  color = 'peach2',
  fontColor = 'brown2',
  borderRadius = 'large',
  borderOpacity = 10,
  onChildTagClick,
  invalidCharsPattern,
}: {
  tag: Tag;
  size?: 'small' | 'medium' | 'large';
  color?: 'white' | 'peach0' | 'peach1' | 'peach2' | 'cream0';
  fontColor?: 'black' | 'brown0' | 'brown2';
  borderRadius?: 'small' | 'large';
  /**
   * tag의 border opacity를 숫자로 전달
   * 5 -> 5%
   * default: 10
   */
  borderOpacity?: 0 | 5 | 10;
  onChildTagClick?: (tag: Tag) => void;
  invalidCharsPattern: RegExp;
}) => {
  const { handleMouseDown, handleMouseMove, handleClick } = useClickWithoutDrag(
    onChildTagClick ? () => onChildTagClick(tag) : () => {}
  );

  return (
    <UneditableTag
      text={`#${tag.name}`}
      color={color}
      fontColor={fontColor}
      borderOpacity={borderOpacity}
      borderRadius={borderRadius}
      size={size}
      invalidCharsPattern={invalidCharsPattern}
      {...(onChildTagClick && {
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onClick: handleClick,
      })}
    />
  );
};

export default TagItem;
