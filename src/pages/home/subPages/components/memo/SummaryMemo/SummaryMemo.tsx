import { HTMLProps, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  UneditableTagList,
  useDeleteMemoManager,
} from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { MemoFooter } from './MemoFooter';
import { ImageBlur } from './ImageBlur';
import { MemoText } from './MemoText';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { Divider } from '@mui/material';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

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
  readonly,
  ...divProps
}: SummaryMemoProps) => {
  const { t } = useTranslation();
  const { handleDeleteMemo } = useDeleteMemoManager();

  const [tags] = useState(memo.tags);

  const haveImageUrl = memo.image_urls && memo.image_urls.length > 0;

  const getStyleByImagePresence = (
    defaultStyle: string,
    styleByImagePresence: string
  ) => (haveImageUrl ? styleByImagePresence : defaultStyle);

  const getBackgroundImageStyleByImagePresence = (
    imageUrl: string | undefined,
    defaultBackground: string
  ) => (haveImageUrl ? `url(${imageUrl})` : defaultBackground);

  const parsedMetadata = memo.metadata ? JSON.parse(memo.metadata) : null;

  const urlPattern = /^https?:\/\/[^\s]+$/;
  const haveOnlyLink = urlPattern.test(memo.content || '');

  const voiceDescriptions = parsedMetadata?.voice_descriptions?.[0] || null;
  const linkDescriptions = parsedMetadata?.link_descriptions?.[0] || null;
  const imageDescriptions = parsedMetadata?.image_descriptions?.[0] || null;

  const descriptions =
    !memo.content && voiceDescriptions
      ? voiceDescriptions.simple_description
      : haveOnlyLink && linkDescriptions
        ? linkDescriptions.simple_description
        : !memo.content && imageDescriptions
          ? imageDescriptions.simple_description
          : null;

  return (
    <div
      {...divProps}
      className={`relative flex p-4 h-full flex-col rounded-2xl overflow-hidden 
        ${border ? 'border border-black border-opacity-10 bg-clip-padding' : ''} 
        ${shadow ? 'shadow-custom' : ''} ${getStyleByImagePresence('bg-white', 'bg-cover bg-center')}
        ${getStyleByImagePresence('min-h-[115px]', 'min-h-56')} ${divProps.onClick ? 'cursor-pointer' : ''}
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
        className={`flex flex-col flex-1 h-full gap-2 relative overflow-hidden select-none`}
      >
        <UneditableTagList
          tags={tags}
          size="small"
          color="peach0"
          borderOpacity={0}
          invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
        />
        {memo.voice_urls?.length > 0 && (
          <AudioPlayer
            className="bg-white rounded-xl shadow-none"
            src={memo.voice_urls[0]}
            customAdditionalControls={[]}
            showJumpControls={false}
            timeFormat="mm:ss"
            showDownloadProgress
            autoPlay={false}
            layout="stacked"
            customProgressBarSection={[
              RHAP_UI.CURRENT_TIME,
              RHAP_UI.PROGRESS_BAR,
              RHAP_UI.DURATION,
            ]}
            customControlsSection={[RHAP_UI.MAIN_CONTROLS, RHAP_UI.VOLUME_CONTROLS]}
            volume={0.5}
          />
        )}
        {memo.content && (
          <MemoText
            textColor={getStyleByImagePresence('#111111', 'white')}
            message={memo.content}
          />
        )}
        {descriptions && (
          <>
            {haveOnlyLink && <Divider />}
            <MemoText
              textColor={getStyleByImagePresence('gray2', 'white')}
              lines={3}
              fontSize={14}
              message={descriptions}
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
