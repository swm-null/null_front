import { Memo } from 'pages/home/contents/_interfaces';
import { CreatedMemoCard } from './CreatedMemoCard';

const CreatedMemoList = ({
  memos,
  softDeleteMemo,
  softRevertMemo,
}: {
  memos: Memo[];
  softDeleteMemo?: (memoId: string) => void;
  softRevertMemo?: (memo: Memo) => void;
}) => {
  return (
    <div className="overflow-y-scroll no-scrollbar mt-4 flex flex-col gap-3">
      {memos.map((memo) => (
        <CreatedMemoCard
          key={memo.id}
          memo={memo}
          softDeleteMemo={softDeleteMemo}
          softRevertMemo={softRevertMemo}
        />
      ))}
    </div>
  );
};

export default CreatedMemoList;
