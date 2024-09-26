import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteMemo, isValidResponse } from 'api';
import { MemoText, TagManager } from 'pages/home/contents/_components';
import { Memo } from 'pages/home/contents/_interfaces';
import { BookIcon, DeleteIcon } from 'assets/icons';
import { format } from 'date-fns';

const CreatedMemoCardHeader = ({
  aiName,
  updatedAt,
  handleDeleteMemo,
}: {
  aiName: string;
  updatedAt: string;
  handleDeleteMemo: () => {};
}) => {
  return (
    <div className="flex items-center">
      <BookIcon />
      <p className="pl-2 text-[#6A5344] font-extrabold select-none">{aiName}</p>
      <div className="flex-1" />
      <p className="text-[#6A5344] select-none">{updatedAt}</p>
      <button className="rounded-full py-1 px-2">
        <DeleteIcon onClick={handleDeleteMemo} />
      </button>
    </div>
  );
};

interface CreatedMemoCardProps {
  memo: Memo;
  softDeleteMemo?: (memoId: string) => void;
  softRevertMemo?: (memo: Memo) => void;
}

const CreatedMemoCard = ({
  memo,
  softDeleteMemo,
  softRevertMemo,
}: CreatedMemoCardProps) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState(memo.content);
  const [tags, setTags] = useState(memo.tags);

  const handleDeleteMemo = async () => {
    softDeleteMemo?.(memo.id);

    const response = await deleteMemo(memo.id);
    if (!isValidResponse(response)) {
      alert(t('pages.memo.deleteErrorMessage'));
      softRevertMemo?.(memo);
    }
  };

  const formatDate = (date: Date): string => format(date, t('memo.dateFormat'));

  return (
    <div className="flex items-start p-4 bg-[#FFF6E3] border-[1.5px] border-[#DBBFAD] rounded-xl">
      <div className="w-full">
        <CreatedMemoCardHeader
          aiName={t('pages.search.ai.name')}
          updatedAt={formatDate(new Date(memo.updated_at))}
          handleDeleteMemo={handleDeleteMemo}
        />
        <TagManager tags={tags} setTags={setTags} editable />
        <MemoText message={message} setMessage={setMessage} />
      </div>
    </div>
  );
};

export default CreatedMemoCard;
