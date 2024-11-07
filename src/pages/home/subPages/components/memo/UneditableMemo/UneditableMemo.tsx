import { useTranslation } from 'react-i18next';
import { ImageMemoText, UneditableTagList } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { MemoHeader } from './MemoHeader';
import { useMemoManager } from '../hook';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';

const UneditableMemo = ({
  memo,
  border,
  handleClose,
}: {
  memo: Memo;
  border?: boolean;
  handleClose: () => void;
}) => {
  const { t } = useTranslation();
  const { handleDeleteMemo } = useMemoManager();

  return (
    <div
      className={`p-7 flex flex-col h-auto w-full bg-[#FFF6E3] border rounded-md gap-8 
        ${border ? 'border-black border-opacity-10 bg-clip-padding' : 'border-gray1'}`}
    >
      <div className="flex flex-1 flex-col gap-[1.14rem] overflow-hidden">
        <MemoHeader
          updatedAt={memo.updated_at}
          dateFormat={t('memo.dateFormatEdit')}
          handleDeleteMemo={() =>
            handleDeleteMemo({ memo, handlePreProcess: handleClose })
          }
        />
        <div className="flex overflow-y-scroll no-scrollbar">
          <ImageMemoText imageUrls={memo.image_urls} message={memo.content} />
        </div>
      </div>
      <div className="flex gap-2">
        <UneditableTagList
          tags={memo.tags}
          size="large"
          color="peach2"
          border={0}
          invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
        />
        <div className="flex ml-auto gap-6 items-center">
          <button
            type="button"
            className="flex h-8 items-center text-brown2 font-medium text-sm px-[27px] py-[3px] 
                rounded-[30px] border border-[#917360]"
            onClick={handleClose}
          >
            {t('memo.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UneditableMemo;
