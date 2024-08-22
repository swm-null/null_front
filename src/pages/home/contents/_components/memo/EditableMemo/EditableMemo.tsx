import { useState, useEffect, useRef } from 'react';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TagManager } from './TagManager';
import { MemoText } from './MemoText';
import { Memo } from 'pages/home/contents/_interfaces';
import {
  deleteMemo,
  updateMemo,
  isUpdateMemoResponse,
  isValidResponse,
} from 'utils/auth';
import { useTranslation } from 'react-i18next';
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

  // 서버에서 메모가 바뀌면, 해당 내용으로 바로 업데이트
  useEffect(() => {
    setMessage(memo.content);
    setTags(memo.tags);
  }, [memo]);

  const handleDeleteMemo = async () => {
    softDeleteMemo && softDeleteMemo(memo.id);

    const response = await deleteMemo(memo.id);
    if (!isValidResponse(response)) {
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

  useEffect(() => {
    const subscription = updateMemoSubject
      .pipe(debounceTime(500))
      .subscribe(async (newMemo: Memo) => {
        softUpdateMemo && softUpdateMemo(newMemo);

        const response = await updateMemo(newMemo.id, newMemo.content);
        if (!isUpdateMemoResponse(response)) {
          alert(t('pages.memo.updateErrorMessage'));
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [updateMemoSubject]);

  return (
    <div
      className={`p-2 grid first-letter:flex-col bg-white border-[1.5px] ${color ? `border-[${color}]` : 'border-gray1'} rounded-md `}
    >
      <p className="text-center">2024년 8월 7일 10:19</p>
      <MemoText
        message={message}
        setMessage={setMessage}
        editable={editable}
        // handleBlur={tryUpdateMemo}
      />
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
              console.log('태그 재생성');
            }}
          >
            태그 재생성
          </button>
          <button
            className="text-right justify-self-end mt-2 text-gray2 rounded-full py-1 px-2"
            onClick={tryUpdateMemo}
          >
            저장
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableMemo;
