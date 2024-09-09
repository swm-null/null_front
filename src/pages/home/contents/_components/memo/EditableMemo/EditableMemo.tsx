import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MemoText, TagManager } from 'pages/home/contents/_components';
import { Memo } from 'pages/home/contents/_interfaces';
import * as Api from 'utils/auth';
import { DeleteIcon } from 'assets/icons';

const EditableMemo = ({
  memo,
  editable = false,
  color,
  softUpdateMemo,
  softDeleteMemo,
  softRevertMemo,
}: {
  memo: Memo;
  editable?: boolean;
  /**
   * 메모에 적용하고 싶은 배경색을 string으로 전달
   * ex) #000000, tailwind에 적용되어있는 color
   */
  color?: string;
  softUpdateMemo?: (newMemo: Memo) => void;
  softDeleteMemo?: (memoId: string) => void;
  softRevertMemo?: (memo: Memo) => void;
}) => {
  const [message, setMessage] = useState(memo.content);
  const [tags, setTags] = useState(memo.tags);
  const updateMemoSubject = useRef(new Subject<Memo>()).current;
  const { t } = useTranslation();

  const handleDeleteMemo = async () => {
    softDeleteMemo && softDeleteMemo(memo.id);

    const response = await Api.deleteMemo(memo.id);
    if (!Api.isValidResponse(response)) {
      alert(t('pages.memo.deleteErrorMessage'));
      softRevertMemo && softRevertMemo(memo);
    }
  };

  const tryUpdateMemo = () => {
    const newMemo = {
      id: memo.id,
      content: message,
      tags,
      image_urls: memo.image_urls,
      created_at: memo.created_at,
      updated_at: memo.updated_at,
    };

    if (memo.content !== newMemo.content) {
      updateMemoSubject.next(newMemo);
    }
  };

  const formatDate = (date: Date): string => {
    return format(date, t('memo.dateFormat'));
  };

  // 서버에서 메모가 바뀌면, 해당 내용으로 바로 업데이트
  useEffect(() => {
    setMessage(memo.content);
    setTags(memo.tags);
  }, [memo]);

  useEffect(() => {
    const subscription = updateMemoSubject
      .pipe(debounceTime(500))
      .subscribe(async (newMemo: Memo) => {
        softUpdateMemo && softUpdateMemo(newMemo);

        const response = await Api.updateMemo(newMemo.id, newMemo.content);
        if (!Api.isUpdateMemoResponse(response)) {
          alert(t('pages.memo.updateErrorMessage'));
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [updateMemoSubject]);

  return (
    <div
      className={`p-2 grid first-letter:flex-col bg-white border-[1.5px] ${color ? `border-[${color}]` : 'border-gray1'} rounded-md min-h-72`}
    >
      <p className="text-center">{formatDate(new Date(memo.updated_at))}</p>
      <MemoText message={message} setMessage={setMessage} editable={editable} />
      <TagManager tags={tags} setTags={setTags} editable={editable} />
      {editable && (
        <div className="flex gap-2">
          <button
            className="text-right justify-self-end mt-2 rounded-full py-1 px-2"
            onClick={handleDeleteMemo}
          >
            <DeleteIcon className="border-gray2" />
          </button>
          <div className="flex flex-1" />

          <button
            className="text-right justify-self-end mt-2 text-gray2 rounded-full py-1 px-2"
            onClick={() => {
              console.log(t('memo.tagRebuild'));
            }}
          >
            {t('memo.tagRebuild')}
          </button>
          <button
            className="text-right justify-self-end mt-2 text-gray2 rounded-full py-1 px-2"
            onClick={tryUpdateMemo}
          >
            {t('memo.save')}
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableMemo;
