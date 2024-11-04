import { Modal } from '@mui/material';
import { UneditableMemo } from 'pages/home/subPages/components';
import { useContext } from 'react';
import { MemoContext } from 'utils';

const MemoModal = () => {
  const { memoModal, closeMemoModal } = useContext(MemoContext);

  if (!memoModal) return <></>;

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Modal open={memoModal.isOpen} onClose={closeMemoModal}>
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        onClick={closeMemoModal}
      >
        <div
          className="flex w-full max-w-[816px] min-h-[411px] rounded-2xl overflow-hidden shadow-custom backdrop-blur-lg"
          onClick={handleContentClick}
        >
          <UneditableMemo
            key={memoModal.memo.id}
            memo={memoModal.memo}
            handleClose={closeMemoModal}
          />
        </div>
      </div>
    </Modal>
  );
};

export default MemoModal;
