import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteMemo, isValidResponse } from 'utils/auth';
import { MemoText } from 'pages/home/contents/_components';
import { Memo } from 'pages/home/contents/_interfaces';
import { DeleteIcon } from 'assets/icons';
import { format } from 'date-fns';

const UneditableMemo = ({
  memo,
  color,
  onClick,
  softDeleteMemo,
  softRevertMemo,
}: {
  memo: Memo;
  /**
   * 메모에 적용하고 싶은 배경색을 string으로 전달
   * ex) #000000, tailwind에 적용되어있는 color
   */
  color?: string;
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

  const handleMouseMove = () => {
    if (
      mouseDownTime.current !== null &&
      Date.now() - mouseDownTime.current > 100
    ) {
      setIsDragging(true);
    }
  };

  const handleMouseUp = () => {
    mouseDownTime.current = null;
    if (!isDragging && onClick) {
      onClick();
    }
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
      className={`p-2 min-h-[115px] flex-col bg-white border-[1.5px] ${color ? `border-[${color}]` : 'border-gray1'} rounded-md`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <MemoText message={message} setMessage={setMessage} />
      <div className="flex flex-wrap gap-1 px-2 pb-10">
        {tags.map((tag, index) => (
          <p key={index} className="break-all">{`#${tag.name}`}</p>
        ))}
      </div>

      <div className="flex flex-1 px-2 items-center">
        <p>{formatDate(new Date(memo.updated_at))}</p>

        <div className="flex flex-1" />
        <button
          className="text-right justify-self-end mt-2 rounded-full py-1 px-2"
          onClick={handleDeleteMemo}
        >
          <DeleteIcon className="border-gray2" />
        </button>
      </div>
    </div>
  );
};

export default UneditableMemo;
