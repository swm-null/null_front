import { Draggable } from '@hello-pangea/dnd';
import { UneditableMemo } from 'pages/home/contents/_components';
import { Memo, Tag } from 'pages/home/contents/_interfaces';

interface DraggableMemoProps {
  memo: Memo;
  tag: Tag;
  index: number;
  handleMemoClick: (memo: Memo, tag: Tag, index: number) => void;
}

const DraggableMemo = ({
  memo,
  tag,
  index,
  handleMemoClick,
}: DraggableMemoProps) => {
  return (
    <Draggable draggableId={memo.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <UneditableMemo
            memo={memo}
            onClick={() => handleMemoClick(memo, tag, index)}
          />
        </div>
      )}
    </Draggable>
  );
};

export default DraggableMemo;
