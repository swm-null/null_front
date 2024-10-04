import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteMemo, isValidResponse } from 'api';
import { MemoText, UneditableTag } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { DeleteIcon } from 'assets/icons';
import { format } from 'date-fns';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';

const UneditableMemo = ({
  memo,
  border,
  onClick,
  softDeleteMemo,
  softRevertMemo,
}: {
  memo: Memo;
  border?: boolean;
  onClick?: () => void;
  softDeleteMemo?: (memoId: string) => void;
  softRevertMemo?: (memo: Memo) => void;
}) => {
  const { t } = useTranslation();

  const [message, setMessage] = useState(memo.content);
  const [tags] = useState(memo.tags);
  const [isDragging, setIsDragging] = useState(false);
  const mouseDownTime = useRef<number | null>(null);

  const handleMouseDown = () => {
    mouseDownTime.current = Date.now();
    setIsDragging(false);
  };

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
    <div
      className={`relative flex p-4 min-h-[115px] flex-col bg-white border-[1.5px] gap-[0.88rem]
        ${border ? `border-shadow0` : ''} rounded-2xl`}
      onMouseDown={handleMouseDown}
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <div className="flex flex-1 gap-1">
            {tags.map((tag, index) => (
              <UneditableTag
                key={index}
                text={`#${tag.name}`}
                invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
                color="peach0"
                fontColor="brown0"
              />
            ))}
          </div>
          {/* TODO: pin 기능 나오면 추가 */}
          {/* <PinIcon className="ml-auto" /> */}
        </div>
        <MemoText message={message} setMessage={setMessage} />
      </div>

      <div className="flex flex-1 items-center">
        <p className="text-[#9A9A9A] font-normal">
          {formatDate(new Date(memo.updated_at))}
        </p>

        <button
          className="text-right justify-self-end ml-auto rounded-full"
          onClick={handleDeleteMemo}
        >
          <DeleteIcon className="stroke-[#9A9A9A] w-[1.125rem] h-[1.125rem]" />
        </button>
      </div>
    </div>
  );
};

export default UneditableMemo;
