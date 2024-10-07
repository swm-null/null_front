import * as Components from 'pages/home/subPages/components';
import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { MemoSection } from './MemoSection';

interface MemoSectionProps {
  memoSectionListData: Array<{
    tag: Tag;
    childTags: Tag[] | null;
    memos: Memo[];
  }>;
  addTagToStack: (tag: Tag) => void;
  handleMemoClick: (memo: Memo, tag: Tag, index: number) => void;
}

const MemoSectionList = ({
  memoSectionListData,
  addTagToStack,
  handleMemoClick,
}: MemoSectionProps) => {
  const isMemoSectionEmpty = () => memoSectionListData.length === 0;
  const hasSingleMemoSection = () => memoSectionListData.length === 1;

  if (isMemoSectionEmpty()) {
    // 처음 유저가 서비스를 사용해서 메모와 태그가 아예 없는 경우
    return null;
  }

  if (hasSingleMemoSection()) {
    const taggedMemo = memoSectionListData[0];

    return (
      <div className="flex flex-1 bg-[#FFF6E366] m-4 mt-2 rounded-2xl shadow-custom backdrop-blur-lg">
        <Components.MemosList>
          {taggedMemo.memos.map((memo, index) => (
            <Components.UneditableMemo
              key={index}
              memo={memo}
              shadow
              border
              onClick={() => handleMemoClick(memo, taggedMemo.tag, index)}
            />
          ))}
        </Components.MemosList>
      </div>
    );
  }

  return (
    <div className="flex flex-1 gap-4 overflow-x-scroll no-scrollbar p-4 pt-2">
      {memoSectionListData.map(({ tag, childTags, memos }) => {
        if (memos.length === 0) {
          return null;
        }

        if (!childTags) {
          throw new Error(`Child tags are missing for tag: ${tag}`);
        }

        return (
          <MemoSection
            key={tag.id}
            tag={tag}
            childTags={childTags}
            memos={memos}
            handleTagClick={() => addTagToStack(tag)}
            handleMemoClick={handleMemoClick}
          />
        );
      })}
    </div>
  );
};

export default MemoSectionList;