import { Tag } from 'pages/home/subPages/interfaces';
import { TagOptions } from '../../TagOptions';

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
  return (
    <div className="inline-flex gap-2">
      <div
        className={`inline-flex flex-shrink-0 bg-transparent text-[#6A5344] select-none 
        ${isCurrentTag ? '' : 'cursor-pointer'}`}
        {...(!isCurrentTag && { onClick: onClick })}
      >
        <span className="focus:outline-none whitespace-nowrap font-bold text-sm">
          {tag.name}
        </span>
      </div>
      <TagOptions tag={tag} isLinked={!isCurrentTag} />
    </div>
  );
};

export default TagPathButton;
