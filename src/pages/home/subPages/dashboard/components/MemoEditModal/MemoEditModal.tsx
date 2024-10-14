import { Modal } from '@mui/material';
import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { EditableMemo } from 'pages/home/subPages/components';

interface MemoEditModalProps {
  open: boolean;
  handleClose: () => void;
  selectedMemo?: Memo;
  selectedMemoTag?: Tag | null;
  selectedMemoIndex?: number;
  updateMemo: (tag: Tag, memo: Memo) => void;
  deleteMemo: (tag: Tag, memoId: string) => void;
  revertMemo: (tag: Tag, index: number, memo: Memo) => void;
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

  const handleUpdateMemo = (tag: Tag, memo: Memo) => {
    updateMemo(tag, memo);
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
              softUpdateMemo={(memo) => handleUpdateMemo(selectedMemoTag, memo)}
              softDeleteMemo={(memoId) => deleteMemo(selectedMemoTag, memoId)}
              softRevertMemo={(selectedMemo) =>
                revertMemo(selectedMemoTag, selectedMemoIndex!, selectedMemo)
              }
              handleSave={handleClose}
            />
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

export default MemoEditModal;
