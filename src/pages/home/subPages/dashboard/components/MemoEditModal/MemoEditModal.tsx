import { Modal } from '@mui/material';
import { EditableMemo } from 'pages/home/subPages/components';
import { useClickWithoutDrag } from 'pages/hooks';
import { useContext } from 'react';
import { MemoContext } from 'utils';

const MemoEditModal = () => {
  const { memoModal, closeMemoModal } = useContext(MemoContext);
  const { handleMouseDown, handleMouseMove, handleClick } =
    useClickWithoutDrag(closeMemoModal);

  if (!memoModal) return <></>;

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Modal open={memoModal.isOpen} onClose={closeMemoModal}>
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <div
          className="flex w-full max-w-[816px] min-h-[411px] max-h-full rounded-2xl overflow-hidden shadow-custom backdrop-blur-lg"
          onClick={handleContentClick}
        >
          <EditableMemo
            key={memoModal.memo.id}
            memo={memoModal.memo}
            handlePreProcess={closeMemoModal}
            mode={memoModal.mode}
          />
        </div>
      </div>
    </Modal>
  );
};

export default MemoEditModal;
