import * as Components from 'pages/home/subPages/components';
import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { MemoSection } from './MemoSection';
import { v4 as uuid_v4 } from 'uuid';
import { useRef } from 'react';
import { useIntersectionObserver } from 'pages/home/subPages/hooks';

interface MemoSectionProps {
  parentTag: Tag | null;
  memoSectionListData: Array<{
    tag: Tag | null;
    childTags: Tag[] | null;
    memos: Memo[];
  }>;
  addTagToStack: (tag: Tag | null) => void;
  handleMemoClick: (memo: Memo, tag: Tag | null, index: number) => void;
  fetchNextPage: () => void;
  fetchNextPageForChildTag: (tag: Tag | null) => void;
}

const MemoSectionList = ({
  parentTag,
  memoSectionListData,
  addTagToStack,
  handleMemoClick,
  fetchNextPage,
  fetchNextPageForChildTag,
}: MemoSectionProps) => {
  const isMemoSectionEmpty = () => memoSectionListData.length === 0;
  const hasSingleMemoSection = () => memoSectionListData.length === 1;

  const observerRef = useRef<HTMLDivElement | null>(null);

  useIntersectionObserver(observerRef, {
    callback: (entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    },
    options: { threshold: 0.5 },
  });

  if (isMemoSectionEmpty()) {
    // 처음 유저가 서비스를 사용해서 메모와 태그가 아예 없는 경우
    return null;
  }

  if (hasSingleMemoSection()) {
    const taggedMemo = memoSectionListData[0];

    return (
      <div
        key={taggedMemo.tag?.id}
        className="flex flex-1 bg-[#FFF6E366] m-4 mt-2 rounded-2xl shadow-custom backdrop-blur-lg"
      >
        <Components.MemosList>
          {taggedMemo.memos.map((memo, index) => (
            <Components.UneditableMemo
              key={memo.id}
              memo={memo}
              shadow
              border
              onClick={() =>
                handleMemoClick(
                  memo,
                  taggedMemo.tag ? taggedMemo?.tag : parentTag,
                  index
                )
              }
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
            key={tag?.id || uuid_v4()}
            tag={tag}
            childTags={childTags}
            memos={memos}
            handleTagClick={() => addTagToStack(tag)}
            handleMemoClick={handleMemoClick}
            fetchNextPage={() => fetchNextPageForChildTag(tag)}
          />
        );
      })}
      <div ref={observerRef} />
    </div>
  );
};

export default MemoSectionList;
