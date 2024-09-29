import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteMemo, isValidResponse } from 'api';
import { MemoText, TagManager } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
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
    <div className="flex">
      <div className="flex gap-2 items-center mr-auto">
        <BookIcon />
        <p className="text-[#6A5344] font-extrabold select-none">{aiName}</p>
      </div>
      <div className="flex gap-2 items-center">
        <p className="text-[#6A5344] select-none">{updatedAt}</p>
        <button className="rounded-full">
          <DeleteIcon onClick={handleDeleteMemo} />
        </button>
      </div>
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
    <div className="flex items-start px-7 py-[1.88rem] bg-[#FFF6E3CC] border-[1.5px] border-[#DBBFAD] rounded-xl shadow-custom">
      <div className="flex flex-col w-full gap-5">
        <CreatedMemoCardHeader
          aiName={t('pages.search.ai.name')}
          updatedAt={formatDate(new Date(memo.updated_at))}
          handleDeleteMemo={handleDeleteMemo}
        />
        <div className="flex flex-col gap-9">
          <TagManager tags={tags} setTags={setTags} editable />
          <MemoText message={message} setMessage={setMessage} />
        </div>
      </div>
    </div>
  );
};

export default CreatedMemoCard;
