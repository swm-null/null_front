import { useCallback } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { Memo, Tag } from 'pages/home/contents/_interfaces';

const useDragAndDropManager = (
  taggedMemos: { tag: Tag; childTags: Tag[] | null; memos: Memo[] }[],
  updateTaggedMemos: (
    newTaggedMemos: { tag: Tag; childTags: Tag[] | null; memos: Memo[] }[]
  ) => void
) => {
  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result;

      if (!destination) return;

      const newTaggedMemos = [...taggedMemos];
      const sourceTagIndex = newTaggedMemos.findIndex(
        (taggedMemo) => taggedMemo.tag.id === source.droppableId
      );
      const destinationTagIndex = newTaggedMemos.findIndex(
        (taggedMemo) => taggedMemo.tag.id === destination.droppableId
      );

      if (sourceTagIndex === -1 || destinationTagIndex === -1) return;

      const [movedMemo] = newTaggedMemos[sourceTagIndex].memos.splice(
        source.index,
        1
      );
      newTaggedMemos[destinationTagIndex].memos.splice(
        destination.index,
        0,
        movedMemo
      );

      updateTaggedMemos(newTaggedMemos);
    },
    [taggedMemos, updateTaggedMemos]
  );

  return { onDragEnd };
};

export default useDragAndDropManager;
