import { HTMLProps, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UneditableTagList, useMemoManager } from 'pages/home/subPages/components';
import { Memo, Tag } from 'pages/home/subPages/interfaces';
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
  readonly,
  ...divProps
}: SummaryMemoProps) => {
  const { t } = useTranslation();
  const { handleDeleteMemo } = useMemoManager();

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

  const voiceDescriptions = parsedMetadata?.voice_descriptions || null;
  const linkDescriptions = parsedMetadata?.link_descriptions || null;
  const imageDescriptions =
    parsedMetadata?.image_descriptions?.[0]?.image_description || null;

  const descriptions = voiceDescriptions
    ? voiceDescriptions[0]
    : linkDescriptions
      ? linkDescriptions[0]
      : imageDescriptions
        ? imageDescriptions
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
          onChildTagClick={(_: Tag) => {
            // FIXME : server에서 특정 태그의 부모 태그를 알 수 있는 api를 주면, 해당 api로 부모 태그를 알아내고, context의
          }}
        />
        {memo.content && (
          <MemoText
            textColor={getStyleByImagePresence('#111111', 'white')}
            message={memo.content}
          />
        )}
        {descriptions && (
          <>
            {memo.content && <Divider className="pt-2" />}
            <MemoText
              textColor={getStyleByImagePresence('gray2', 'white')}
              lines={3}
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
