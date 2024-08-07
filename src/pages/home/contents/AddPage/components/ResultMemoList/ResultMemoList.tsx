import { useTranslation } from 'react-i18next';
import { EditableMemo as ResultMemo } from 'pages/home/contents/_components';
import { Memo } from 'pages/home/contents/_interfaces';

interface ResultMemoListProps {
  memos: Memo[];
  softUpdateResultMemo: (newMemo: Memo) => void;
  softDeleteResultMemo: (memoId: string) => void;
  softRevertResultMemo: (index: number, deletedMemo: Memo) => void;
}

const ResultMemoList = ({
  memos,
  softUpdateResultMemo,
  softDeleteResultMemo,
  softRevertResultMemo,
}: ResultMemoListProps) => {
  const { t } = useTranslation();
  return (
    <>
      <span className="mt-3">{t('pages.add.addMemoMessage')}</span>
      <div className="flex flex-col flex-1 overflow-y-scroll no-scrollbar my-4">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
          {memos.map((memo, index) => (
            <ResultMemo
              key={memo.id}
              memo={memo}
              softUpdateMemo={(newMemo) => softUpdateResultMemo(newMemo)}
              softDeleteMemo={() => softDeleteResultMemo(memo.id)}
              softRevertMemo={(deletedMemo) =>
                softRevertResultMemo(index, deletedMemo)
              }
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ResultMemoList;
