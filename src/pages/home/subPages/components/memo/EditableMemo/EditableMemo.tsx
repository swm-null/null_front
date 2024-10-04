import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MemoText, TagManager } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import * as Api from 'api';
import { CheckedIcon, DeleteIcon, NotCheckedIcon, PinIcon } from 'assets/icons';
import { Checkbox } from '@mui/material';

const EditableMemo = ({
  memo,
  editable = false,
  border,
  softUpdateMemo,
  softDeleteMemo,
  softRevertMemo,
}: {
  memo: Memo;
  editable?: boolean;
  border?: boolean;
  softUpdateMemo?: (newMemo: Memo) => void;
  softDeleteMemo?: (memoId: string) => void;
  softRevertMemo?: (memo: Memo) => void;
}) => {
  const [message, setMessage] = useState(memo.content);
  const [tags, setTags] = useState(memo.tags);
  const [tagRebuild, setTagRebuild] = useState(false);
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
    return format(date, t('memo.dateFormatEdit'));
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

        const response = await Api.updateMemo(
          newMemo.id,
          newMemo.content
          // tagRebuild // TODO: 태그 재생성 기능 추가되면 구현
        );
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
      className={`p-7 flex flex-col first-letter:flex-col bg-[#FFF6E3] border-[1.5px] rounded-md min-h-72 gap-8 
      ${border ? `border-shadow0` : 'border-gray1'}`}
    >
      <div className="flex flex-1 flex-col gap-[1.14rem]">
        <div className="flex gap-[1.44rem] items-center">
          <PinIcon className="mr-auto" width={'1.5rem'} height={'1.5rem'} />
          <p className="text-center font-medium font-brown1">
            {formatDate(new Date(memo.updated_at))}
          </p>
          <DeleteIcon className="border-gray2" onClick={handleDeleteMemo} />
        </div>

        <div className="flex mb-auto flex-col flex-1">
          <MemoText
            message={message}
            setMessage={setMessage}
            editable={editable}
          />
        </div>
      </div>

      {editable && (
        <div className="flex gap-2">
          <TagManager tags={tags} setTags={setTags} editable={editable} />
          <div className="flex ml-auto gap-6 items-center">
            <div className="flex gap-[0.62rem] items-center">
              <Checkbox
                checked={tagRebuild}
                onChange={() => setTagRebuild(!tagRebuild)}
                disableRipple
                icon={<NotCheckedIcon />}
                checkedIcon={<CheckedIcon />}
                sx={{ padding: 0 }}
              />
              <p className="text-brown1 font-medium">{t('memo.tagRebuild')}</p>
            </div>
            <button
              className="flex text-brown1 font-medium rounded-full"
              onClick={tryUpdateMemo}
            >
              {t('memo.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableMemo;
