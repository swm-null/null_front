import { UneditableTag } from 'pages/home/subPages/components';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { Tag } from 'pages/home/subPages/interfaces';
import { DeleteIcon, EditIcon, RightIcon } from 'assets/icons';

interface DashboardMemoSectionHeaderProps {
  tag: Tag;
  childTags: Tag[];
  handleTagClick: () => void;
}

const DashboardMemoSectionHeader = ({
  tag,
  childTags,
  handleTagClick,
}: DashboardMemoSectionHeaderProps) => {
  return (
    <div className="flex w-full px-3 py-4 flex-col bg-[#FFF6E380]">
      <div className="flex w-full">
        <p className="text-[#3e3e3e]">{tag.name}</p>
        <EditIcon />
        <DeleteIcon />
        <div
          className="ml-auto flex items-center cursor-pointer"
          onClick={handleTagClick}
        >
          <RightIcon color="black" height={35} width={35} />
        </div>
      </div>
      <div className="flex gap-2 overflow-x-scroll no-scrollbar">
        {childTags.map((childTag, index) => (
          <UneditableTag
            key={index}
            text={childTag.name}
            color="#FFFFFF"
            invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardMemoSectionHeader;
