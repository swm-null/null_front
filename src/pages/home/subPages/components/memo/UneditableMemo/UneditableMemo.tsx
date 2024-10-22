import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteMemo, isValidResponse } from 'api';
import { MemoText } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { MemoFooter } from './MemoFooter';
import { MemoHeader } from './MemoHeader';
import { ImageBlur } from './ImageBlur';

const UneditableMemo = ({
  memo,
  border,
  shadow,
  onClick,
  softDeleteMemo,
  softRevertMemo,
}: {
  memo: Memo;
  border?: boolean;
  shadow?: boolean;
  onClick?: () => void;
  softDeleteMemo?: (memoId: string) => void;
  softRevertMemo?: (memo: Memo) => void;
}) => {
  const { t } = useTranslation();

  const [message, setMessage] = useState(memo.content);
  const [tags] = useState(memo.tags);
  const [isDragging, setIsDragging] = useState(false);

  const haveImageUrl = memo.image_urls && memo.image_urls.length > 0;

  const getStyleByImagePresence = (
    defaultStyle: string,
    styleByImagePresence: string
  ) => (haveImageUrl ? styleByImagePresence : defaultStyle);
  const getBackgroundImageStyleByImagePresence = (
    imageUrl: string | undefined,
    defaultBackground: string
  ) => (haveImageUrl ? `url(${imageUrl})` : defaultBackground);

  const handleDeleteMemo = async () => {
    softDeleteMemo && softDeleteMemo(memo.id);

    const response = await deleteMemo(memo.id);
    if (!isValidResponse(response)) {
      alert(t('pages.memo.deleteErrorMessage'));
      softRevertMemo && softRevertMemo(memo);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(false);
  };

  const handleMouseMove = () => {
    setIsDragging(true);
  };

  const handleClick = () => {
    if (!isDragging && onClick) {
      onClick();
      setIsDragging(false);
    }
  };

  return (
    <div
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
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
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
          handleDeleteMemo={handleDeleteMemo}
        />
      </div>
    </div>
  );
};

export default UneditableMemo;
