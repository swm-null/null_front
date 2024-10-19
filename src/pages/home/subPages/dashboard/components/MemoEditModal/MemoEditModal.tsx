import { Modal } from '@mui/material';
import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { EditableMemo } from 'pages/home/subPages/components';

interface MemoEditModalProps {
  open: boolean;
  handleClose: () => void;
  selectedMemo?: Memo;
  selectedMemoTag?: Tag | null;
  selectedMemoIndex?: number;
  updateMemo: (memo: Memo) => void;
  deleteMemo: (memoId: string) => void;
  revertMemo: (memo: Memo) => void;
}

const MemoEditModal = ({
  open,
  handleClose,
  selectedMemo,
  selectedMemoTag,
  selectedMemoIndex,
  updateMemo,
  deleteMemo,
  revertMemo,
}: MemoEditModalProps) => {
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleUpdateMemo = (memo: Memo) => {
    updateMemo(memo);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <div
          className="flex w-full max-w-[816px] min-h-[411px] rounded-2xl overflow-hidden shadow-custom backdrop-blur-lg"
          onClick={handleContentClick}
        >
          {selectedMemo && selectedMemoTag ? (
            <EditableMemo
              key={selectedMemoIndex}
              memo={selectedMemo}
              editable
              softUpdateMemo={handleUpdateMemo}
              softDeleteMemo={deleteMemo}
              softRevertMemo={revertMemo}
              handleSave={handleClose}
            />
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

export default MemoEditModal;
