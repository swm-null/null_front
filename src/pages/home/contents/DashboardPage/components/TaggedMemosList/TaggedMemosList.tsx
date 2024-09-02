import { Droppable } from '@hello-pangea/dnd';
import { Memo, Tag } from 'pages/home/contents/_interfaces';
import { DraggableMemo } from './DraggableMemo';
import { ListHeader } from './ListHeader';

interface TaggedMemosListProps {
  tag: Tag;
  childTags: Tag[];
  memos: Memo[];
  handleTagClick: () => void;
  handleMemoClick: (memo: Memo, tag: Tag, index: number) => void;
}

const TaggedMemosList = ({
  tag,
  childTags,
  memos,
  handleTagClick,
  handleMemoClick,
}: TaggedMemosListProps) => {
  return (
    <div className="w-[360px] flex-shrink-0 py-2">
      <ListHeader
        tag={tag}
        childTags={childTags}
        handleTagClick={handleTagClick}
      />

      <div className="overflow-y-auto no-scrollbar max-h-[calc(100vh-200px)] py-2">
        <Droppable droppableId={tag.id.toString()} type="MEMO">
          {(provided) => (
            <div
              className="grid grid-cols-1 gap-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {memos.map((memo, index) => (
                <DraggableMemo
                  key={memo.id}
                  memo={memo}
                  tag={tag}
                  index={index}
                  handleMemoClick={handleMemoClick}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default TaggedMemosList;
