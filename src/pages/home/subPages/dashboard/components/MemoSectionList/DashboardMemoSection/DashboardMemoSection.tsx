import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { DashboardMemoSectionHeader } from './DashboardMemoSectionHeader';
import { UneditableMemo } from 'pages/home/subPages/components';

interface DashboardMemoSectionProps {
  tag: Tag;
  childTags: Tag[];
  memos: Memo[];
  handleTagClick: () => void;
  handleMemoClick: (memo: Memo, tag: Tag, index: number) => void;
}

const DashboardMemoSection = ({
  tag,
  childTags,
  memos,
  handleTagClick,
  handleMemoClick,
}: DashboardMemoSectionProps) => {
  return (
    <div className="flex flex-col min-w-[360px] w-[360px] rounded-2xl overflow-hidden bg-[#FFF6E366] border border-[#0000001A]">
      <DashboardMemoSectionHeader
        tag={tag}
        childTags={childTags}
        handleTagClick={handleTagClick}
      />

      <div className="flex-1 h-full overflow-scroll no-scrollbar py-4 px-[0.87rem] border-t border-[#0000001A]">
        <div className="flex flex-col flex-1 gap-[0.88rem]">
          {memos.map((memo, index) => (
            <UneditableMemo
              memo={memo}
              onClick={() => handleMemoClick(memo, tag, index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardMemoSection;
