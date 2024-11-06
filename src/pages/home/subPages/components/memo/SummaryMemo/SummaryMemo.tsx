import { HTMLProps, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMemoManager } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { MemoFooter } from './MemoFooter';
import { MemoHeader } from './MemoHeader';
import { ImageBlur } from './ImageBlur';
import { MemoText } from './MemoText';

interface SummaryMemoProps extends HTMLProps<HTMLDivElement> {
  memo: Memo;
  border?: boolean;
  shadow?: boolean;
}

const SummaryMemo = ({ memo, border, shadow, ...divProps }: SummaryMemoProps) => {
  const { t } = useTranslation();

  const { handleDeleteMemo } = useMemoManager();

  const memoRef = useRef<HTMLDivElement>(null);
  const memoTextRef = useRef<HTMLParagraphElement>(null);
  const [tags] = useState(memo.tags);
  const [maxHeight, setMaxHeight] = useState<number | undefined>();
  const [isEllipsis, setIsEllipsis] = useState(false);

  useEffect(() => {
    if (memoRef.current) {
      setMaxHeight(memoRef.current.clientWidth);
    }
  }, [memoRef.current?.offsetWidth]);

  useEffect(() => {
    if (memoTextRef.current) {
      const newIsTextEllipsis =
        memoTextRef.current.scrollHeight > memoTextRef.current.offsetHeight;

      setIsEllipsis(newIsTextEllipsis);
    }
  }, [memoTextRef.current]);

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
      className={`relative flex p-4 min-h-[115px] h-full flex-col rounded-2xl overflow-hidden
        ${border ? 'border border-black border-opacity-10 bg-clip-padding' : ''} 
        ${shadow ? 'shadow-custom' : ''} ${getStyleByImagePresence('bg-white', 'bg-cover bg-center')}
        ${getStyleByImagePresence('', 'aspect-square')} ${divProps.onClick ? 'cursor-pointer' : ''}
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
        ref={memoRef}
        className={`flex flex-col flex-1 h-full gap-2 relative z-10 overflow-hidden`}
        style={{
          maxHeight: maxHeight,
          minHeight: isEllipsis ? maxHeight : undefined,
        }}
      >
        <MemoHeader tags={tags} />
        <MemoText
          ref={memoTextRef}
          textColor={getStyleByImagePresence('#111111', 'white')}
          message={memo.content}
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

export default SummaryMemo;
