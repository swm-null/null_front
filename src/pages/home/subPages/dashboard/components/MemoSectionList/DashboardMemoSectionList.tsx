import * as Components from 'pages/home/subPages/components';
import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { DashboardMemoSection } from './DashboardMemoSection';

interface DashboardMemoSectionProps {
  memoSectionListData: Array<{
    tag: Tag;
    childTags: Tag[] | null;
    memos: Memo[];
  }>;
  addTagToStack: (tag: Tag) => void;
  handleMemoClick: (memo: Memo, tag: Tag, index: number) => void;
}

const DashboardMemoSectionList = ({
  memoSectionListData,
  addTagToStack,
  handleMemoClick,
}: DashboardMemoSectionProps) => {
  const isMemoSectionEmpty = () => memoSectionListData.length === 0;
  const hasSingleMemoSection = () => memoSectionListData.length === 1;

  if (isMemoSectionEmpty()) {
    // 처음 유저가 서비스를 사용해서 메모와 태그가 아예 없는 경우
    return null;
  }

  if (hasSingleMemoSection()) {
    const taggedMemo = memoSectionListData[0];

    return (
      <Components.MemosList>
        {taggedMemo.memos.map((memo, index) => (
          <Components.UneditableMemo key={index} memo={memo} />
        ))}
      </Components.MemosList>
    );
  }

  return (
    <div className="flex flex-1 gap-4 overflow-x-scroll">
      {memoSectionListData.map(({ tag, childTags, memos }) => {
        if (memos.length === 0) {
          return null;
        }

        if (!childTags) {
          throw new Error(`Child tags are missing for tag: ${tag}`);
        }

        return (
          <DashboardMemoSection
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

export default DashboardMemoSectionList;
