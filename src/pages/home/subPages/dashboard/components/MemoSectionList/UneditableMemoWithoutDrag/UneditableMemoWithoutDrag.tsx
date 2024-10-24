import { UneditableMemo } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { HTMLProps } from 'react';
import { useClickWithoutDrag } from 'pages/home/subPages/hooks';

interface UneditableMemoProps extends HTMLProps<HTMLDivElement> {
  memo: Memo;
  border?: boolean;
  shadow?: boolean;
  onClick: () => void;
  softDeleteMemo?: (memoId: string) => void;
  softRevertMemo?: (memo: Memo) => void;
}

const UneditableMemoWithoutDrag = ({
  memo,
  border,
  shadow,
  onClick,
  softDeleteMemo,
  softRevertMemo,
  ...divProps
}: UneditableMemoProps) => {
  const { handleMouseDown, handleMouseMove, handleClick } =
    useClickWithoutDrag(onClick);

  return (
    <UneditableMemo
      {...divProps}
      key={memo?.id}
      memo={memo}
      shadow
      border
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    />
  );
};

export default UneditableMemoWithoutDrag;
