import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteMemo, isValidResponse } from 'api';
import { MemoText } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { MemoFooter } from './MemoFooter';
import { MemoHeader } from './MemoHeader';

const UneditableMemo = ({
  memo,
  border,
  shadow,
  onClick,
  softDeleteMemo,
  softRevertMemo,
}: {
  memo: Memo;
  border?: boolean;
  shadow?: boolean;
  onClick?: () => void;
  softDeleteMemo?: (memoId: string) => void;
  softRevertMemo?: (memo: Memo) => void;
}) => {
  const { t } = useTranslation();

  const [message, setMessage] = useState(memo.content);
  const [tags] = useState(memo.tags);

  const handleDeleteMemo = async () => {
    softDeleteMemo && softDeleteMemo(memo.id);

    const response = await deleteMemo(memo.id);
    if (!isValidResponse(response)) {
      alert(t('pages.memo.deleteErrorMessage'));
      softRevertMemo && softRevertMemo(memo);
    }
  };

  return (
    <div
      className={`relative flex p-4 min-h-[115px] flex-col bg-white gap-[0.88rem]
        ${border ? 'border border-black border-opacity-10 bg-clip-padding' : ''} rounded-2xl ${shadow ? 'shadow-custom backdrop-blur-lg' : ''}`}
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        <MemoHeader tags={tags} />
        <MemoText message={message} setMessage={setMessage} />
      </div>
      <MemoFooter
        updatedAt={memo.updated_at}
        dateFormat={t('memo.dateFormat')}
        handleDeleteMemo={handleDeleteMemo}
      />
    </div>
  );
};

export default UneditableMemo;
