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
        <p>2024년 8월 7일 10:19</p>

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
