import { useTranslation } from 'react-i18next';
import { EditableMemo as ResultMemo } from 'pages/home/contents/@components';
import { Memo } from 'pages/home/contents/@interfaces';

interface ResultMemoListProps {
  memos: Memo[];
  updateResultMemo: (index: number, newMemo: Memo) => void;
  deleteResultMemo: (index: number) => void;
}

const ResultMemoList = ({
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
              softDeleteMemo={() => deleteResultMemo(index)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ResultMemoList;
