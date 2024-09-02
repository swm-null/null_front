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
    <div className="min-w-[360px] w-[360px] flex flex-col overflow-hidden py-2">
      <ListHeader
        tag={tag}
        childTags={childTags}
        handleTagClick={handleTagClick}
      />

      <div className="flex-1 overflow-y-auto pt-2">
        <Droppable droppableId={tag.id.toString()} type="MEMO">
          {(provided) => (
            <div
              className="grid grid-cols-1 gap-2"
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
