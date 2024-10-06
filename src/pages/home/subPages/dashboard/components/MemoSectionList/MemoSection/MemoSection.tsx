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
    <div
      className="flex flex-col w-auto rounded-2xl overflow-hidden flex-shrink-0
      bg-[#FFF6E366] border border-black border-opacity-10 bg-clip-padding shadow-custom backdrop-blur-lg"
    >
      <MemoSectionHeader
        tag={tag}
        childTags={childTags}
        handleTagClick={handleTagClick}
      />

      <div className="flex-1 h-full overflow-scroll no-scrollbar py-4 px-[0.87rem] border-t border-black border-opacity-10 bg-clip-padding">
        <div className="flex flex-col flex-1 gap-[0.4rem]">
          {memos.map((memo, index) => (
            <div className="flex flex-col w-[244px]">
              <UneditableMemo
                memo={memo}
                shadow
                border
                onClick={() => handleMemoClick(memo, tag, index)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemoSection;
