import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageMemoText, TagManager } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { MemoHeader } from './MemoHeader.tsx/index.ts';
import { TagRebuildCheckbox } from './TagRebuildCheckbox/index.ts';
import { useMemoManager } from '../hook';

const EditableMemo = ({
  memo,
  editable = false,
  border,
  handlePreProcess,
}: {
  memo: Memo;
  editable?: boolean;
  border?: boolean;
  handlePreProcess: () => void;
}) => {
  const [message, setMessage] = useState(memo.content);
  const [tags, setTags] = useState(memo.tags);
  const [tagRebuild, setTagRebuild] = useState(false);
  const { t } = useTranslation();

  const { handleUpdateMemo, handleDeleteMemo } = useMemoManager();

  useEffect(() => {
    setMessage(memo.content);
    setTags(memo.tags);
  }, [memo]);

  return (
    <div
      className={`p-7 flex flex-col h-auto w-full bg-[#FFF6E3] border rounded-md gap-8 
        ${border ? 'border-black border-opacity-10 bg-clip-padding' : 'border-gray1'}`}
    >
      <div className="flex flex-1 flex-col gap-[1.14rem]">
        <MemoHeader
          updatedAt={memo.updated_at}
          dateFormat={t('memo.dateFormatEdit')}
          handleDeleteMemo={() => handleDeleteMemo({ memo, handlePreProcess })}
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
              onClick={() =>
                handleUpdateMemo({
                  memo,
                  newMessage: message,
                  newTags: tags,
                  newImageUrls: memo.image_urls,
                  handlePreProcess,
                })
              }
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
