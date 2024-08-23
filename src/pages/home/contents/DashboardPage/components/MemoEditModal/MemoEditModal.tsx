import React from 'react';
import { Modal } from '@mui/material';
import { Memo, Tag } from 'pages/home/contents/_interfaces';
import { EditableMemo } from 'pages/home/contents/_components';

interface MemoEditModalProps {
  open: boolean;
  handleClose: () => void;
  selectedMemo?: Memo;
  selectedMemoTag?: Tag;
  selectedMemoIndex?: number;
  updateViewMemo: (tag: Tag, memo: Memo) => void;
  deleteViewMemo: (tag: Tag, memoId: string) => void;
  revertViewMemo: (tag: Tag, index: number, memo: Memo) => void;
}

const MemoEditModal: React.FC<MemoEditModalProps> = ({
  open,
  handleClose,
  selectedMemo,
  selectedMemoTag,
  selectedMemoIndex,
  updateViewMemo,
  deleteViewMemo,
  revertViewMemo,
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg">
          {selectedMemo && selectedMemoTag ? (
            <EditableMemo
              key={selectedMemoIndex}
              memo={selectedMemo}
              editable
              softUpdateMemo={(memo) => updateViewMemo(selectedMemoTag, memo)}
              softDeleteMemo={(memoId) =>
                deleteViewMemo(selectedMemoTag, memoId)
              }
              softRevertMemo={(selectedMemo) =>
                revertViewMemo(
                  selectedMemoTag,
                  selectedMemoIndex!,
                  selectedMemo
                )
              }
            />
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

export default MemoEditModal;