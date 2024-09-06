import * as Components from 'pages/home/contents/_components';
import { Memo, Tag } from 'pages/home/contents/_interfaces';
import { MemoSection } from './MemoSection';

interface MemoSectionListProps {
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
}: MemoSectionListProps) => {
  const isMemoSectionEmpty = () => memoSectionListData.length === 0;
  const hasSingleMemoSection = () => memoSectionListData.length === 1;

  if (isMemoSectionEmpty()) {
    // 처음 유저가 서비스를 사용해서 메모와 태그가 아예 없는 경우
    return null;
  }

  if (hasSingleMemoSection()) {
    const taggedMemo = memoSectionListData[0];

    return (
      <div className="px-4">
        <Components.MemosList>
          {taggedMemo.memos.map((memo, index) => (
            <Components.UneditableMemo key={index} memo={memo} />
          ))}
        </Components.MemosList>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-full gap-4 overflow-x-scroll">
      {memoSectionListData.map(({ tag, childTags, memos }) => {
        if (memos.length === 0) {
          return null; // 빈 메모 리스트 처리
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
