import { UneditableTag } from 'pages/home/subPages/components';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { Tag } from 'pages/home/subPages/interfaces';
import { RightIcon } from 'assets/icons';
import { useClickWithoutDrag } from 'pages/home/subPages/hooks';
import { TagWithOptions } from './TagWithOptions';

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
      className="flex flex-col px-3 py-4 bg-[#FFF6E380] gap-4 w-[268px]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <div className="flex w-full items-center gap-3">
        <TagWithOptions tag={tag} />
        <div className="ml-auto flex items-center cursor-pointer">
          <RightIcon color="black" />
        </div>
      </div>
      <div className="flex overflow-hidden">
        <div className="flex gap-1 overflow-x-auto no-scrollbar flex-nowrap">
          {childTags.length > 0 ? (
            childTags.map((childTag, index) => (
              <UneditableTag
                key={index}
                className="px-2 py-1 h-6"
                text={`#${childTag.name}`}
                color="white"
                fontColor="brown2"
                border={5}
                invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
              />
            ))
          ) : (
            <div className="h-6" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoSectionHeader;
