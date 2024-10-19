import { UneditableTag } from 'pages/home/subPages/components';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { Tag } from 'pages/home/subPages/interfaces';
import { DeleteIcon, EditIcon, RightIcon } from 'assets/icons';

interface MemoSectionHeaderProps {
  tag: Tag;
  childTags: Tag[];
  width: number;
  handleTagClick: () => void;
}

const MemoSectionHeader = ({
  tag,
  childTags,
  width,
  handleTagClick,
}: MemoSectionHeaderProps) => {
  return (
    <div
      className="flex flex-col w-full min-w-0 px-3 py-4 bg-[#FFF6E380] gap-4"
      style={{ width: width }}
    >
      <div className="flex w-full min-w-0 items-center gap-3">
        <p className="text-[#3e3e3e]">{tag.name}</p>
        <div className="flex gap-1">
          <EditIcon width="1.125rem" height="1.125rem" />
          <DeleteIcon className="text-brown1 w-[1.125rem] h-[1.125rem]" />
        </div>
        <div
          className="ml-auto flex items-center cursor-pointer"
          onClick={handleTagClick}
        >
          <RightIcon color="black" />
        </div>
      </div>
      <div className="flex overflow-hidden w-fit">
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
