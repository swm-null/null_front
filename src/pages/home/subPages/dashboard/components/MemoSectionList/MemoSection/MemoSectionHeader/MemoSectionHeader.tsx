import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { Tag } from 'pages/home/subPages/interfaces';
import { RightIcon } from 'assets/icons';
import { useClickWithoutDrag } from 'pages/hooks';
import { TagWithOptions } from './TagWithOptions';
import { UneditableTagList } from 'pages/home/subPages/components/tag/UneditableTagList';

interface MemoSectionHeaderProps {
  tag: Tag;
  childTags: Tag[];
  handleTagClick: () => void;
}

const MemoSectionHeader = ({
  tag,
  childTags,
  handleTagClick,
}: MemoSectionHeaderProps) => {
  const { handleMouseDown, handleMouseMove, handleClick } =
    useClickWithoutDrag(handleTagClick);

  return (
    // FIXME: 일단 width 때러박고 나중에, css 만질때 수정하기
    <div
      className="flex flex-col px-3 py-4 bg-[#FFF6E380] gap-4 w-[268px] cursor-pointer"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <div className="flex w-full items-center gap-3">
        <TagWithOptions tag={tag} />
        <div className="ml-auto flex items-center">
          <RightIcon color="black" />
        </div>
      </div>
      <div className="flex overflow-hidden">
        {childTags.length > 0 ? (
          <UneditableTagList
            tags={childTags}
            size="medium"
            color="white"
            border={5}
            invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
          />
        ) : (
          <div className="h-6" />
        )}
      </div>
    </div>
  );
};

export default MemoSectionHeader;
