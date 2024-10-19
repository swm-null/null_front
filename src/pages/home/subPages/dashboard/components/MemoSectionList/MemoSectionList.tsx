import { Memo, Tag, TagRelation } from 'pages/home/subPages/interfaces';
import { MemoSection } from './MemoSection';
import { v4 as uuid_v4 } from 'uuid';
import { useRef } from 'react';
import { useIntersectionObserver } from 'pages/home/subPages/hooks';
import { SortOption } from '../../interfaces';

interface MemoSectionListProps {
  parentTag: Tag | null;
  tagRelations: TagRelation[];
  sortOption: SortOption;
  addTagToStack: (tag: Tag | null) => void;
  handleMemoClick: (memo: Memo, tag: Tag | null, index: number) => void;
  fetchNextPage: () => void;
}

const MemoSectionList = ({
  parentTag,
  tagRelations,
  sortOption,
  addTagToStack,
  handleMemoClick,
  fetchNextPage,
}: MemoSectionListProps) => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useIntersectionObserver(observerRef, {
    callback: (entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    },
    options: { threshold: 0.5 },
  });

  return (
    <div className="flex flex-1 gap-4 overflow-x-scroll no-scrollbar p-4 pt-2">
      {[
        { tag: parentTag, child_tags: [], isLinked: true },
        ...tagRelations,
      ].map((tagRelation) => {
        const tag = tagRelation.tag;
        const childTags = tagRelation.child_tags || [];
        const isLinked =
          'isLinked' in tagRelation ? tagRelation.isLinked : false;

        return (
          <MemoSection
            key={tag?.id || uuid_v4()}
            tag={tag}
            childTags={childTags}
            isLinked={isLinked}
            sortOption={sortOption}
            handleTagClick={() => addTagToStack(tag)}
            handleMemoClick={(memo: Memo, memoIndex: number) =>
              handleMemoClick(memo, tag || parentTag, memoIndex)
            }
          />
        );
      })}
      <div ref={observerRef} />
    </div>
  );
};

export default MemoSectionList;
