import { Tag, TagRelation } from 'pages/home/subPages/interfaces';
import { MemoSection } from './MemoSection';
import { v4 as uuid_v4 } from 'uuid';
import { useContext, useEffect, useRef } from 'react';
import {
  useHorizontalScroll,
  useIntersectionObserver,
} from 'pages/home/subPages/hooks';
import { SortOption } from 'pages/home/subPages/types';
import { TagContext } from 'utils';

interface MemoSectionListProps {
  tagRelations: TagRelation[];
  sortOption: SortOption;
  addTagToStack: (tag: Tag | Tag[] | null) => void;
  fetchNextPage: () => void;
}

const MemoSectionList = ({
  tagRelations,
  sortOption,
  addTagToStack,
  fetchNextPage,
}: MemoSectionListProps) => {
  const { selectedTag } = useContext(TagContext);
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
  }, [selectedTag, scrollRef?.current]);

  if (hasNoSection() && selectedTag) {
    return (
      <div className="flex flex-1 mx-4 pb-2 pt-2">
        <MemoSection
          key={`section-${selectedTag?.id}`}
          tag={selectedTag}
          sortOption={sortOption}
          childTags={[]}
          isLeaf
          isLinked
          handleTagClick={() => {}}
        />
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex flex-1 overflow-x-scroll mx-4 pb-2 pt-2
        scrollbar-thin scrollbar-thumb-peach0 scrollbar-track-transparent hover:scrollbar-thumb-peach0"
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
    >
      <div className="flex gap-4">
        {selectedTag && (
          <MemoSection
            key={`section-${selectedTag.id}`}
            tag={selectedTag}
            childTags={[]}
            isLinked
            sortOption={sortOption}
            handleTagClick={() => addTagToStack(selectedTag)}
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
