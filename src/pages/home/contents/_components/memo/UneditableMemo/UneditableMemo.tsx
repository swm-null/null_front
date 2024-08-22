import { Memo } from 'pages/home/contents/_interfaces';
import { useState } from 'react';
import { deleteMemo, isValidResponse } from 'utils/auth';
import { MemoText } from '../EditableMemo/MemoText';
import { DeleteIcon } from 'assets/icons';
import { useTranslation } from 'react-i18next';

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
  const [message, setMessage] = useState(memo.content);
  const [tags] = useState(memo.tags);
  const { t } = useTranslation();
  const handleDeleteMemo = async () => {
    softDeleteMemo && softDeleteMemo(memo.id);

    const response = await deleteMemo(memo.id);
    if (!isValidResponse(response)) {
      alert(t('pages.memo.deleteErrorMessage'));
      softRevertMemo && softRevertMemo(memo);
    }
  };

  const getRandomDate = () => {
    const startDate = new Date('2024-01-01T00:00:00');
    const endDate = new Date(Date.now());

    const getRandomDateInRange = (startDate: Date, endDate: Date): Date => {
      // 타임스탬프 범위
      const startTimestamp = startDate.getTime();
      const endTimestamp = endDate.getTime();

      // 랜덤 타임스탬프 생성
      const randomTimestamp =
        Math.random() * (endTimestamp - startTimestamp) + startTimestamp;

      return new Date(randomTimestamp);
    };

    return formatDate(getRandomDateInRange(startDate, endDate));
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더합니다.
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  };

  return (
    <div
      className={`p-2 min-h-[115px] first-letter:flex-col bg-white border-[1.5px] ${color ? `border-[${color}]` : 'border-gray1'} rounded-md `}
      onClick={onClick}
    >
      <MemoText message={message} setMessage={setMessage} />
      <div className="flex flex-wrap gap-1 px-2 pb-10">
        {tags.map((tag, index) => (
          <p key={index} className="break-all">{`#${tag.name}`}</p>
        ))}
      </div>

      <div className="flex flex-1 px-2 items-center">
        <p>
          {memo.updated_at
            ? formatDate(new Date(memo.updated_at))
            : getRandomDate()}
        </p>

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
