import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { MemoSectionHeader } from './MemoSectionHeader';
import { UneditableMemo } from 'pages/home/subPages/components';

interface MemoSectionProps {
  tag: Tag;
  childTags: Tag[];
  memos: Memo[];
  handleTagClick: () => void;
  handleMemoClick: (memo: Memo, tag: Tag, index: number) => void;
}

const MemoSection = ({
  tag,
  childTags,
  memos,
  handleTagClick,
  handleMemoClick,
}: MemoSectionProps) => {
  return (
    <div className="flex flex-col min-w-[360px] w-[360px] rounded-2xl overflow-hidden bg-[#FFF6E366] border border-[#0000001A]">
      <MemoSectionHeader
        tag={tag}
        childTags={childTags}
        handleTagClick={handleTagClick}
      />

      <div className="flex-1 h-full overflow-scroll no-scrollbar py-4 px-[0.87rem] border-t border-[#0000001A]">
        <div className="flex flex-col flex-1 gap-[0.4rem]">
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

export default MemoSection;
