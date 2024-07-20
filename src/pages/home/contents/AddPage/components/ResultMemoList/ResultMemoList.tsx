import { EditableMemo as ResultMemo } from 'pages/home/contents/@components/memo';
import { Memo } from 'pages/interfaces/MemoInterface';
import { useTranslation } from 'react-i18next';

interface ResultMemoListProps {
  memos: Memo[];
  updateResultMemo: (index: number, newMemo: Memo) => void;
  deleteResultMemo: (index: number) => void;
}

export const ResultMemoList = ({
  memos,
  updateResultMemo,
  deleteResultMemo,
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
              updateMemo={(newMemo) => updateResultMemo(index, newMemo)}
              deleteMemo={() => deleteResultMemo(index)}
            />
          ))}
        </div>
      </div>
    </>
  );
};
