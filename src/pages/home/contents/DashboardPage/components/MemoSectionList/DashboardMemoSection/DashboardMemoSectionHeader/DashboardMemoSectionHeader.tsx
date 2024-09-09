import { UneditableTag } from 'pages/home/contents/_components';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { Tag } from 'pages/home/contents/_interfaces';
import { RightIcon } from 'assets/icons';

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
    <div className="bg-[#989898] rounded-t-2xl flex flex-row justify-between items-stretch overflow-hidden">
      <div className="grid w-full flex-col px-3 py-4">
        <p className="mb-2 text-[#3e3e3e]">{tag.name}</p>
        <div className="flex gap-2 overflow-x-scroll no-scrollbar">
          {childTags.map((childTag, index) => (
            <UneditableTag
              key={index}
              text={childTag.name}
              invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
            />
          ))}
        </div>
      </div>
      <div
        className="bg-[#5D5D5D] flex items-center cursor-pointer"
        onClick={handleTagClick}
      >
        <RightIcon color="white" height={35} width={35} />
      </div>
    </div>
  );
};

export default DashboardMemoSectionHeader;
