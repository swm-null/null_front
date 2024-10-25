import { HTMLProps, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Memo } from 'pages/home/subPages/interfaces';
import { MemoFooter } from './MemoFooter';
import { MemoHeader } from './MemoHeader';
import { ImageBlur } from './ImageBlur';
import { MemoText } from '../ImageMemoText/MemoText';
import { useMemoDeleteManager } from '../hooks';

interface UneditableMemoProps extends HTMLProps<HTMLDivElement> {
  memo: Memo;
  border?: boolean;
  shadow?: boolean;
}

const UneditableMemo = ({
  memo,
  border,
  shadow,
  ...divProps
}: UneditableMemoProps) => {
  const { t } = useTranslation();

  const { handleDeleteMemo } = useMemoDeleteManager();

  const [message, setMessage] = useState(memo.content);
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

  return (
    <div
      {...divProps}
      className={`relative flex p-4 min-h-[115px] h-auto flex-col gap-[0.88rem] rounded-2xl overflow-hidden
        ${border ? 'border border-black border-opacity-10 bg-clip-padding' : ''} 
        ${shadow ? 'shadow-custom' : ''} ${getStyleByImagePresence('bg-white', 'bg-cover bg-center')}
        ${getStyleByImagePresence('', 'aspect-[1/1]')}
      `}
      style={{
        backgroundImage: getBackgroundImageStyleByImagePresence(
          memo.image_urls?.[0],
          'none'
        ),
      }}
    >
      {haveImageUrl && <ImageBlur />}

      <div className={`flex flex-col h-full gap-2 relative z-10`}>
        <MemoHeader tags={tags} />
        <MemoText
          textColor={getStyleByImagePresence('#111111', 'white')}
          message={message}
          setMessage={setMessage}
        />
        <MemoFooter
          textColor={getStyleByImagePresence('gray2', 'white')}
          updatedAt={memo.updated_at}
          dateFormat={t('memo.dateFormat')}
          handleDeleteMemo={() => handleDeleteMemo({ memo })}
        />
      </div>
    </div>
  );
};

export default UneditableMemo;
