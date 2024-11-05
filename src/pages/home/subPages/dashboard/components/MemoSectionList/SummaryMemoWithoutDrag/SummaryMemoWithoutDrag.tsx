import { SummaryMemo } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { HTMLProps, useContext } from 'react';
import { useClickWithoutDrag } from 'pages/hooks';
import { MemoContext } from 'utils';

interface SummaryMemoWithoutDragProps extends HTMLProps<HTMLDivElement> {
  memo: Memo;
  border?: boolean;
  shadow?: boolean;
  softDeleteMemo?: (memoId: string) => void;
  softRevertMemo?: (memo: Memo) => void;
}

const SummaryMemoWithoutDrag = ({
  memo,
  border,
  shadow,
  softDeleteMemo,
  softRevertMemo,
  ...divProps
}: SummaryMemoWithoutDragProps) => {
  const { openMemoEditModal } = useContext(MemoContext);
  const { handleMouseDown, handleMouseMove, handleClick } = useClickWithoutDrag(() =>
    openMemoEditModal(memo)
  );

  return (
    <SummaryMemo
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

export default SummaryMemoWithoutDrag;
