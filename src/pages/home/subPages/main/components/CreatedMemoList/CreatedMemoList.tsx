import { Memo } from 'pages/home/subPages/interfaces';
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
    <div className="flex flex-col gap-3">
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