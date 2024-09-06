import { Memo, Tag } from 'pages/home/contents/_interfaces';
import { ListHeader } from './ListHeader';
import { UneditableMemo } from 'pages/home/contents/_components';

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
    <div className="min-w-[360px] w-[360px] flex flex-col overflow-hidden py-2">
      <ListHeader
        tag={tag}
        childTags={childTags}
        handleTagClick={handleTagClick}
      />

      <div className="flex-1 overflow-y-auto pt-2">
        <div className="grid grid-cols-1 gap-2">
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
