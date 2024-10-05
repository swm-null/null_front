import { UneditableTag } from 'pages/home/subPages/components';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { Tag } from 'pages/home/subPages/interfaces';
import { DeleteIcon, EditIcon, RightIcon } from 'assets/icons';

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
  return (
    <div className="flex w-full px-3 py-4 flex-col bg-[#FFF6E380] gap-4">
      <div className="flex w-full items-center gap-3">
        <p className="text-[#3e3e3e]">{tag.name}</p>
        <div className="flex gap-1">
          <EditIcon width="1.125rem" height="1.125rem" />
          <DeleteIcon width="1.125rem" height="1.125rem" />
        </div>
        <div
          className="ml-auto flex items-center cursor-pointer"
          onClick={handleTagClick}
        >
          <RightIcon color="black" />
        </div>
      </div>
      <div className="flex gap-2 overflow-x-scroll no-scrollbar">
        {childTags.map((childTag, index) => (
          <UneditableTag
            key={index}
            text={`#${childTag.name}`}
            color="white"
            fontColor="brown1"
            border
            invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
          />
        ))}
      </div>
    </div>
  );
};

export default MemoSectionHeader;
