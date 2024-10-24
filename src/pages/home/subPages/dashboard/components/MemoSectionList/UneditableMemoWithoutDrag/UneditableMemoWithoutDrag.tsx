import { UneditableMemo } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { HTMLProps, useContext } from 'react';
import { useClickWithoutDrag } from 'pages/home/subPages/hooks';
import { DashboardModalContext } from 'utils';

interface UneditableMemoProps extends HTMLProps<HTMLDivElement> {
  memo: Memo;
  border?: boolean;
  shadow?: boolean;
  softDeleteMemo?: (memoId: string) => void;
  softRevertMemo?: (memo: Memo) => void;
}

const UneditableMemoWithoutDrag = ({
  memo,
  border,
  shadow,
  softDeleteMemo,
  softRevertMemo,
  ...divProps
}: UneditableMemoProps) => {
  const { openMemoEditModal } = useContext(DashboardModalContext);
  const { handleMouseDown, handleMouseMove, handleClick } = useClickWithoutDrag(() =>
    openMemoEditModal(memo)
  );

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
