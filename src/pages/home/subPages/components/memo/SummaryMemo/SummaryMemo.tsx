import { HTMLProps, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RecordingControls,
  UneditableTagList,
  useMemoManager,
} from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { MemoFooter } from './MemoFooter';
import { ImageBlur } from './ImageBlur';
import { MemoText } from './MemoText';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { Divider } from '@mui/material';

interface SummaryMemoProps extends HTMLProps<HTMLDivElement> {
  memo: Memo;
  border?: boolean;
  shadow?: boolean;
  readonly?: boolean;
}

const SummaryMemo = ({
  memo,
  border,
  shadow,
  readonly = false,
  ...divProps
}: SummaryMemoProps) => {
  const { t } = useTranslation();
  const { handleDeleteMemo } = useMemoManager();

  const [tags] = useState(memo.tags);

  const parsedMetadata = memo.metadata ? JSON.parse(memo.metadata) : null;
  const voiceDescriptions = parsedMetadata?.voice_record_descriptions || [];

  const haveImageUrl = memo.image_urls && memo.image_urls.length > 0;

  const getStyleByImagePresence = (
    defaultStyle: string,
    styleByImagePresence: string
  ) => (haveImageUrl ? styleByImagePresence : defaultStyle);

  const getBackgroundImageStyleByImagePresence = (
    imageUrl: string | undefined,
    defaultBackground: string
  ) => (haveImageUrl ? `url(${imageUrl})` : defaultBackground);

  const getProxiedUrl = (url: string) => {
    const originalUrl = new URL(url);
    return `/audio${originalUrl.pathname}`;
  };

  return (
    <div
      {...divProps}
      className={`relative flex p-4 min-h-[115px] h-full flex-col rounded-2xl overflow-hidden 
        ${border ? 'border border-black border-opacity-10 bg-clip-padding' : ''} 
        ${shadow ? 'shadow-custom' : ''} ${getStyleByImagePresence('bg-white', 'bg-cover bg-center')}
        ${getStyleByImagePresence('', 'min-h-56')} ${divProps.onClick ? 'cursor-pointer' : ''}
      `}
      style={{
        backgroundImage: getBackgroundImageStyleByImagePresence(
          memo.image_urls?.[0],
          'none'
        ),
      }}
    >
      {haveImageUrl && <ImageBlur />}

      <div
        className={`flex flex-col flex-1 h-full gap-2 relative z-10 overflow-hidden`}
      >
        <UneditableTagList
          tags={tags}
          size="small"
          color="peach0"
          border={0}
          invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
        />

        {memo.voice_urls?.[0] && (
          <>
            <div className="flex mb-auto flex-col xsm:flex-row w-full flex-1 gap-2 flex-wrap">
              <div className="xs:w-60 w-full h-24 max-w-72 rounded-2xl overflow-hidden">
                <RecordingControls audioUrl={getProxiedUrl(memo.voice_urls[0])} />
              </div>
              {voiceDescriptions[0] && (
                <div className="flex flex-1 flex-col w-full text-sm">
                  <p style={{ color: getStyleByImagePresence('#111111', 'white') }}>
                    {voiceDescriptions[0].transcription_summary}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
        {memo.content && (
          <>
            {memo.voice_urls?.[0] && <Divider />}
            <MemoText
              textColor={getStyleByImagePresence('#111111', 'white')}
              message={memo.content}
            />
          </>
        )}
        <MemoFooter
          textColor={getStyleByImagePresence('gray2', 'white')}
          updatedAt={memo.updated_at}
          dateFormat={t('memo.dateFormat')}
          readonly={readonly}
          handleDeleteMemo={() => handleDeleteMemo({ memo })}
        />
      </div>
    </div>
  );
};

export default SummaryMemo;
