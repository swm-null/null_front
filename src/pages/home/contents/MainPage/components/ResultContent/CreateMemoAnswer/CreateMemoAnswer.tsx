import { useState } from 'react';
import { deleteMemo, isValidResponse } from 'utils/auth';
import { DeleteIcon } from 'assets/icons';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { TagManager, MemoText } from 'pages/home/contents/_components';
import { Memo } from 'pages/home/contents/_interfaces';

const CreateMemoAnswer = ({
  memo,
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
    <div className="flex items-start">
      <img
        src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
        className="w-7 h-7 mr-3 ml-1 mt-1 rounded-full"
      />
      <div className="w-full">
        <div className="flex flex-1 px-2 items-center">
          <div className="flex flex-1" />
          <p>{formatDate(new Date(memo.updated_at))}</p>
          <button
            className="text-right justify-self-end mt-2 rounded-full py-1 px-2"
            onClick={handleDeleteMemo}
          >
            <DeleteIcon className="border-gray2" />
          </button>
        </div>
        <MemoText message={message} setMessage={setMessage} />
        <div className="flex flex-wrap gap-1 px-2 mt-4">
          <TagManager tags={tags} setTags={setTags} editable />
        </div>
      </div>
    </div>
  );
};

export default CreateMemoAnswer;
