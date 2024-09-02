import { Droppable, Draggable } from '@hello-pangea/dnd';
import { RightIcon } from 'assets/icons';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { UneditableMemo, UneditableTag } from 'pages/home/contents/_components';
import { Memo, Tag } from 'pages/home/contents/_interfaces';

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
      <div className="bg-[#989898] rounded-t-2xl flex flex-row justify-between items-stretch overflow-hidden">
        <div className="grid w-full flex-col px-3 py-4">
          <p className="mb-2 text-[#3e3e3e]">{tag.name}</p>
          <div className="flex gap-2 overflow-x-scroll no-scrollbar">
            {childTags.map((childTag, index) => (
              <UneditableTag
                key={index}
                text={childTag.name}
                invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
              />
            ))}
          </div>
        </div>
        <div
          className="bg-[#5D5D5D] flex items-center cursor-pointer"
          onClick={handleTagClick}
        >
          <RightIcon color="white" height={35} width={35} />
        </div>
      </div>

      <div className="overflow-y-auto no-scrollbar max-h-[calc(100vh-200px)] py-2">
        <Droppable droppableId={tag.id.toString()} type="MEMO">
          {(provided) => (
            <div
              className="grid grid-cols-1 gap-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {memos.map((memo, index) => (
                <Draggable
                  key={memo.id}
                  draggableId={memo.id.toString()}
                  index={index}
                >
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
