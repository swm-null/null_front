import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteMemo, isValidResponse } from 'api';
import { MemoText } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { MemoFooter } from './MemoFooter';
import { MemoHeader } from './MemoHeader';

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
  const mouseDownTime = useRef<number | null>(null);

  const haveImageUrl = memo.image_urls && memo.image_urls.length > 0;
  const getColor = (defaultColor: string, colorOnImage: string) =>
    haveImageUrl ? colorOnImage : defaultColor;

  const handleDeleteMemo = async () => {
    softDeleteMemo && softDeleteMemo(memo.id);

    const response = await deleteMemo(memo.id);
    if (!isValidResponse(response)) {
      alert(t('pages.memo.deleteErrorMessage'));
      softRevertMemo && softRevertMemo(memo);
    }
  };

  const handleMouseDown = () => {
    mouseDownTime.current = Date.now();
    setIsDragging(false);
  };

  const handleMouseMove = () => {
    if (mouseDownTime.current !== null && Date.now() - mouseDownTime.current > 100) {
      setIsDragging(true);
    }
  };

  const handleMouseUp = () => {
    mouseDownTime.current = null;
    if (!isDragging && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`relative flex p-4 min-h-[115px] flex-col gap-[0.88rem] rounded-2xl overflow-hidden
        ${border ? 'border border-black border-opacity-10 bg-clip-padding' : ''} 
        ${shadow ? 'shadow-custom' : ''} 
        ${getColor('bg-white', 'bg-cover bg-center')}
      `}
      style={{
        backgroundImage:
          memo.image_urls && memo.image_urls.length > 0
            ? `url(${memo.image_urls[0]})`
            : 'none',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {memo.image_urls && memo.image_urls.length > 0 && <ImageBlur />}

      <div className={`flex flex-col gap-2 relative z-10`}>
        <MemoHeader tags={tags} />
        <MemoText
          textColor={getColor('#111111', 'white')}
          message={message}
          setMessage={setMessage}
        />
        <MemoFooter
          textColor={getColor('gray2', 'white')}
          updatedAt={memo.updated_at}
          dateFormat={t('memo.dateFormat')}
          handleDeleteMemo={handleDeleteMemo}
        />
      </div>
    </div>
  );
};

const ImageBlur = () => (
  <div
    className="absolute inset-0
      bg-[rgba(38,38,38,0.45)] 
      backdrop-blur-[1.5px] rounded-2xl overflow-hidden"
    style={{
      strokeWidth: '1px',
      stroke: 'rgba(0, 0, 0, 0.8)',
    }}
  />
);

export default UneditableMemo;
