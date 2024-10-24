import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ImageMemoText, TagManager } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import * as Api from 'api';
import { MemoHeader } from './MemoHeader.tsx/index.ts';
import { TagRebuildCheckbox } from './TagRebuildCheckbox/index.ts';

const EditableMemo = ({
  memo,
  editable = false,
  border,
  softUpdateMemo,
  softDeleteMemo,
  softRevertMemo,
  handleSave,
}: {
  memo: Memo;
  editable?: boolean;
  border?: boolean;
  softUpdateMemo?: (newMemo: Memo) => void;
  softDeleteMemo?: (memoId: string) => void;
  softRevertMemo?: (memo: Memo) => void;
  handleSave: () => void;
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
    handleSave();
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
      className={`p-7 flex flex-col h-auto w-full bg-[#FFF6E3] border rounded-md gap-8 
        ${border ? 'border-black border-opacity-10 bg-clip-padding' : 'border-gray1'}`}
    >
      <div className="flex flex-1 flex-col gap-[1.14rem]">
        <MemoHeader
          updatedAt={memo.updated_at}
          dateFormat={t('memo.dateFormatEdit')}
          handleDeleteMemo={handleDeleteMemo}
        />
        <ImageMemoText
          imageUrls={memo.image_urls}
          message={message}
          setMessage={setMessage}
          editable={editable}
        />
      </div>

      {editable && (
        <div className="flex gap-2">
          <TagManager tags={tags} setTags={setTags} editable={editable} />
          <div className="flex ml-auto gap-6 items-center">
            <TagRebuildCheckbox
              checked={tagRebuild}
              setChecked={setTagRebuild}
              label={t('memo.tagRebuild')}
            />
            <button
              className="flex h-8 items-center text-brown2 font-medium text-sm px-[27px] py-[3px] rounded-[30px] border border-[#917360]"
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
