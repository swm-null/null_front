import { Tag } from 'pages/home/subPages/interfaces';
import { TagOptions } from '../../TagOptions';
import { useClickWithoutDrag } from 'pages/hooks';

interface TagPathButtonProps {
  tag: Tag;
  isCurrentTag?: boolean;
  onClick?: () => void;
}

const TagPathButton = ({
  tag,
  isCurrentTag = false,
  onClick,
}: TagPathButtonProps) => {
  const { handleMouseDown, handleMouseMove, handleClick } = useClickWithoutDrag(
    onClick ? onClick : () => {}
  );

  return (
    <div className="inline-flex gap-2">
      <div
        className={`inline-flex flex-shrink-0 bg-transparent text-[#6A5344] select-none 
        ${isCurrentTag ? '' : 'cursor-pointer'}`}
        {...(!isCurrentTag && {
          onMouseDown: handleMouseDown,
          onMouseMove: handleMouseMove,
          onClick: handleClick,
        })}
      >
        <span className="focus:outline-none whitespace-nowrap font-bold text-sm">
          {tag.name}
        </span>
      </div>
      {isCurrentTag && <TagOptions tag={tag} />}
    </div>
  );
};

export default TagPathButton;
