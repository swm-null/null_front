import { UneditableTag } from 'pages/home/subPages/components';
import { Tag } from 'pages/home/subPages/interfaces';
import { useClickWithoutDrag } from 'pages/hooks';

const TagItem = ({
  tag,
  onChildTagClick,
  invalidCharsPattern,
}: {
  tag: Tag;
  onChildTagClick: (tag: Tag) => void;
  invalidCharsPattern: RegExp;
}) => {
  const { handleMouseDown, handleMouseMove, handleClick } = useClickWithoutDrag(() =>
    onChildTagClick(tag)
  );

  return (
    <UneditableTag
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
};

export default TagItem;
