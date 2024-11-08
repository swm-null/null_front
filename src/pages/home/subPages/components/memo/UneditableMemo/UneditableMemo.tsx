import { useTranslation } from 'react-i18next';
import {
  ImageMemoText,
  RecordingControls,
  UneditableTagList,
} from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { MemoHeader } from './MemoHeader';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { Divider } from '@mui/material';

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

  const parsedMetadata = memo.metadata ? JSON.parse(memo.metadata) : null;
  const voiceDescriptions = parsedMetadata?.voice_record_descriptions || [];

  const getProxiedUrl = (url: string) => {
    const originalUrl = new URL(url);
    return `/audio${originalUrl.pathname}`;
  };

  return (
    <div
      className={`p-7 flex flex-col h-auto w-full bg-[#FFF6E3] border rounded-md gap-8 
        ${border ? 'border-black border-opacity-10 bg-clip-padding' : 'border-gray1'}`}
    >
      <div className="flex flex-1 flex-col h-full gap-[1.14rem] overflow-hidden">
        <MemoHeader updatedAt={memo.updated_at} dateFormat={t('memo.dateFormat')} />
        <div className="flex flex-col flex-1 overflow-y-scroll no-scrollbar gap-4">
          <ImageMemoText imageUrls={memo.image_urls} message={memo.content} />
          {memo.voice_urls && memo.voice_urls.length > 0 && (
            <>
              <Divider className="mt-auto" />
              <div className="flex mb-auto flex-col xsm:flex-row w-full flex-1 gap-5 xsm:gap-9 flex-wrap flex-shrink-0">
                <div className="xs:w-60 w-full max-w-72 rounded-2xl overflow-hidden flex-shrink-0">
                  <RecordingControls audioUrl={getProxiedUrl(memo.voice_urls[0])} />
                </div>
                {voiceDescriptions[0] && (
                  <div className="flex flex-1 flex-col w-full text-sm">
                    <p>{voiceDescriptions[0].transcription_summary}</p>
                  </div>
                )}
              </div>
            </>
          )}
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
