import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteMemo, isValidResponse } from 'api';
import { MemoText, TagManager } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { DeleteIcon } from 'assets/icons';
import { format } from 'date-fns';
import { Skeleton } from '@mui/material';

const CreatedMemoCardHeader = ({
  updatedAt,
  handleDeleteMemo,
  children,
}: {
  updatedAt: string;
  handleDeleteMemo: () => void;
  children: ReactNode;
}) => {
  return (
    <div className="flex">
      <div className="flex gap-2 items-center mr-auto">{children}</div>
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

  const formatDate = (date: string): string => {
    if (date.endsWith('Z')) {
      return format(new Date(date), t('memo.dateFormat'));
    }
    return format(`${date}Z`, t('memo.dateFormat'));
  };

  return (
    <div
      className="flex items-start px-7 py-[1.88rem] bg-[#FFF6E3CC] border border-black border-opacity-10 bg-clip-padding rounded-xl 
      shadow-custom backdrop-blur-lg"
    >
      <div className="flex flex-col w-full gap-9">
        <CreatedMemoCardHeader
          updatedAt={formatDate(memo.updated_at)}
          handleDeleteMemo={handleDeleteMemo}
        >
          {tags.length === 0 ? (
            <Skeleton animation="wave" width={50} />
          ) : (
            <TagManager tags={tags} setTags={setTags} />
          )}
        </CreatedMemoCardHeader>
        <MemoText message={message} setMessage={setMessage} />
      </div>
    </div>
  );
};

export default CreatedMemoCard;
