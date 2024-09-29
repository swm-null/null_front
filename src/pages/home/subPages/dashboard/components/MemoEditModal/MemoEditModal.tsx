import React from 'react';
import { Modal } from '@mui/material';
import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { EditableMemo } from 'pages/home/subPages/components';

interface MemoEditModalProps {
  open: boolean;
  handleClose: () => void;
  selectedMemo?: Memo;
  selectedMemoTag?: Tag;
  selectedMemoIndex?: number;
  updateMemo: (tag: Tag, memo: Memo) => void;
  deleteMemo: (tag: Tag, memoId: string) => void;
  revertMemo: (tag: Tag, index: number, memo: Memo) => void;
}

const MemoEditModal: React.FC<MemoEditModalProps> = ({
  open,
  handleClose,
  selectedMemo,
  selectedMemoTag,
  selectedMemoIndex,
  updateMemo,
  deleteMemo,
  revertMemo,
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
              softUpdateMemo={(memo) => updateMemo(selectedMemoTag, memo)}
              softDeleteMemo={(memoId) => deleteMemo(selectedMemoTag, memoId)}
              softRevertMemo={(selectedMemo) =>
                revertMemo(selectedMemoTag, selectedMemoIndex!, selectedMemo)
              }
            />
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

export default MemoEditModal;
