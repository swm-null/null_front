import { Tag, TagRelation } from 'pages/home/subPages/interfaces';
import { MemoSection } from './MemoSection';
import { v4 as uuid_v4 } from 'uuid';
import { useEffect, useRef } from 'react';
import {
  useHorizontalScroll,
  useIntersectionObserver,
} from 'pages/home/subPages/hooks';
import { SortOption } from 'pages/home/subPages/types';
import { LeafMemoSection } from './LeafMemoSection';

interface MemoSectionListProps {
  parentTag: Tag | null;
  tagRelations: TagRelation[];
  sortOption: SortOption;
  addTagToStack: (tag: Tag | null) => void;
  fetchNextPage: () => void;
}

const MemoSectionList = ({
  parentTag,
  tagRelations,
  sortOption,
  addTagToStack,
  fetchNextPage,
}: MemoSectionListProps) => {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { onDragStart, onDragMove, onDragEnd } = useHorizontalScroll({ scrollRef });

  const hasNoSection = () => tagRelations.length === 0;

  useIntersectionObserver(observerRef, {
    callback: (entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    },
    options: { threshold: 0.5 },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [parentTag, scrollRef?.current]);

  if (hasNoSection()) {
    return <LeafMemoSection parentTag={parentTag} sortOption={sortOption} />;
  }

  return (
    <div
      ref={scrollRef}
      className="flex flex-1 overflow-x-scroll no-scrollbar p-4 pt-2"
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
    >
      <div className="flex gap-4">
        {parentTag && (
          <MemoSection
            key={`section-${parentTag.id}`}
            tag={parentTag}
            childTags={[]}
            isLinked={true}
            sortOption={sortOption}
            handleTagClick={() => addTagToStack(parentTag)}
          />
        )}
        {tagRelations.map((tagRelation) => {
          const tag = tagRelation.tag;
          const childTags = tagRelation.child_tags || [];

          return (
            <MemoSection
              key={`section-${tag?.id}` || uuid_v4()}
              tag={tag}
              childTags={childTags}
              isLinked={false}
              sortOption={sortOption}
              handleTagClick={() => addTagToStack(tag)}
            />
          );
        })}
      </div>
      <div ref={observerRef} className="min-w-[1px] bg-transparent" />
    </div>
  );
};

export default MemoSectionList;
