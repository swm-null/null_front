import { EditableMemo as OriginalMemo } from 'components/memo';
import { Memo } from 'interfaces/MemoInterface';
import { Masonry } from '@mui/lab';

interface OriginalMemoListProps {
  originalMemos: Memo[];
  updateOriginalMemo: (index: number, newMemo: Memo) => void;
  deleteOriginalMemo: (index: number) => void;
}

export const OriginalMemoList = ({
  originalMemos,
  updateOriginalMemo,
  deleteOriginalMemo,
}: OriginalMemoListProps) => {
  return (
    <div className="flex flex-col flex-1 overflow-y-scroll no-scrollbar my-4">
      <Masonry columns={{ sm: 1, md: 2, lg: 3 }} spacing={2}>
        {originalMemos.map((memo, index) => (
          <OriginalMemo
            editable
            key={memo.id}
            memo={memo}
            updateMemo={(newMemo) => updateOriginalMemo(index, newMemo)}
            deleteMemo={() => deleteOriginalMemo(index)}
          />
        ))}
      </Masonry>
    </div>
  );
};
