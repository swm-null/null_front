import { UneditableTag } from 'pages/home/subPages/components';
import { Tag } from 'pages/home/subPages/interfaces';
import { useClickWithoutDrag } from 'pages/hooks';

const TagItem = ({
  tag,
  size = 'medium',
  onChildTagClick,
  invalidCharsPattern,
}: {
  tag: Tag;
  size?: 'small' | 'medium' | 'large';
  onChildTagClick?: (tag: Tag) => void;
  invalidCharsPattern: RegExp;
}) => {
  const { handleMouseDown, handleMouseMove, handleClick } = useClickWithoutDrag(
    onChildTagClick ? () => onChildTagClick(tag) : () => {}
  );

  return (
    <UneditableTag
      text={`#${tag.name}`}
      color="peach1-transparent"
      fontColor="brown2"
      border={10}
      size={size}
      invalidCharsPattern={invalidCharsPattern}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    />
  );
};

export default TagItem;
