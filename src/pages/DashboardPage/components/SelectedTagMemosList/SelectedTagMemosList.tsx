import { EditableMemo as SelectedTagMemo } from 'components/memo';
import { Memo } from 'interfaces/MemoInterface';
import { Masonry } from '@mui/lab';

interface SelectedTagMemosListProps {
  selectedTagMemos: Memo[];
  updateSelectedTagMemo: (index: number, newMemo: Memo) => void;
  deleteSelectedTagMemo: (index: number) => void;
}

export const SelectedTagMemosList = ({
  selectedTagMemos,
  updateSelectedTagMemo,
  deleteSelectedTagMemo,
}: SelectedTagMemosListProps) => {
  return (
    <div className="flex flex-col flex-1 overflow-y-scroll no-scrollbar my-4">
      <Masonry columns={{ sm: 1, md: 2, lg: 3 }} spacing={2}>
        {selectedTagMemos.map((memo, index) => (
          <SelectedTagMemo
            editable
            key={memo.id}
            memo={memo}
            updateMemo={(newMemo) => updateSelectedTagMemo(index, newMemo)}
            deleteMemo={() => deleteSelectedTagMemo(index)}
          />
        ))}
      </Masonry>
    </div>
  );
};
