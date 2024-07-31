import { useState, useEffect, useRef } from 'react';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TagManager } from './TagManager';
import { MemoText } from './MemoText';
import { Memo } from 'pages/home/contents/@interfaces';
import {
  deleteMemo,
  updateMemo,
  isUpdateMemoResponse,
  isValidResponse,
} from 'utils/auth';
import { useTranslation } from 'react-i18next';

const EditableMemo = ({
  memo,
  editable = false,
  softUpdateMemo,
  softDeleteMemo,
  softRevertMemo,
}: {
  memo: Memo;
  editable?: boolean;
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
    const newMemo = { id: memo.id, content: message, tags };

    // FIXME: 2024.07.30
    // tag 비교 내용. 태그 수정 기능 추가시 추가(이번주 내에 수정 가능할 것으로 추정)
    // !arraysEqual(memo.tags, newMemo.tags);

    if (memo.content !== newMemo.content) {
      updateMemoSubject.next(newMemo);
    }
  };

  // const arraysEqual = (a: any[], b: any[]) => {
  //   return JSON.stringify(a) === JSON.stringify(b);
  // };

  useEffect(() => {
    const subscription = updateMemoSubject
      .pipe(debounceTime(1000))
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
    <div className="p-2 grid first-letter:flex-col bg-gray1 rounded-md border-[1px]">
      <MemoText
        message={message}
        setMessage={setMessage}
        editable={editable}
        handleBlur={tryUpdateMemo}
      />
      <TagManager tags={tags} setTags={setTags} editable={editable} />
      {editable && (
        <button
          className="text-right justify-self-end mt-2 bg-gray2 text-white rounded-full py-2 px-6"
          onClick={handleDeleteMemo}
        >
          삭제
        </button>
      )}
    </div>
  );
};

export default EditableMemo;
