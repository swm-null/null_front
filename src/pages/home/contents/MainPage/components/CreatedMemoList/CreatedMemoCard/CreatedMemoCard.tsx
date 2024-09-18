import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteMemo, isValidResponse } from 'utils/auth';
import { MemoText, TagManager } from 'pages/home/contents/_components';
import { Memo } from 'pages/home/contents/_interfaces';
import { BookIcon, DeleteIcon } from 'assets/icons';
import { format } from 'date-fns';

const CreatedMemoCard = ({
  memo,
  softDeleteMemo,
  softRevertMemo,
}: {
  memo: Memo;
  softDeleteMemo?: (memoId: string) => void;
  softRevertMemo?: (memo: Memo) => void;
}) => {
  const { t } = useTranslation();

  const [message, setMessage] = useState(memo.content);
  const [tags, setTags] = useState(memo.tags);

  const handleDeleteMemo = async () => {
    softDeleteMemo && softDeleteMemo(memo.id);

    const response = await deleteMemo(memo.id);
    if (!isValidResponse(response)) {
      alert(t('pages.memo.deleteErrorMessage'));
      softRevertMemo && softRevertMemo(memo);
    }
  };

  const formatDate = (date: Date): string => {
    return format(date, t('memo.dateFormat'));
  };

  return (
    <div className="flex items-start p-4 bg-[#FFF6E3] border-[1.5px] border-[#DBBFAD] rounded-xl">
      <div className="w-full">
        <div className="flex flex-1 items-center">
          <BookIcon />
          <p className="pl-2 select-none text-[#6A5344] font-extrabold">
            {t('pages.search.ai.name')}
          </p>
          <div className="flex flex-1" />
          <p className="select-none text-[#6A5344]">
            {formatDate(new Date(memo.updated_at))}
          </p>
          <button className="text-right justify-self-end rounded-full py-1 px-2">
            <DeleteIcon onClick={handleDeleteMemo} />
          </button>
        </div>
        <div className="flex flex-wrap gap-1 mt-3 mb-4">
          <TagManager tags={tags} setTags={setTags} editable />
        </div>
        <MemoText message={message} setMessage={setMessage} />
      </div>
    </div>
  );
};

export default CreatedMemoCard;
