import { Modal } from '@mui/material';
import { EditableMemo } from 'pages/home/subPages/components';
import { useContext } from 'react';
import { DashboardModalContext } from 'utils';

const MemoEditModal = () => {
  const { memoEditModal, closeMemoEditModal } = useContext(DashboardModalContext);

  if (!memoEditModal) return <></>;

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Modal open={memoEditModal.isOpen} onClose={closeMemoEditModal}>
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        onClick={closeMemoEditModal}
      >
        <div
          className="flex w-full max-w-[816px] min-h-[411px] rounded-2xl overflow-hidden shadow-custom backdrop-blur-lg"
          onClick={handleContentClick}
        >
          <EditableMemo
            key={memoEditModal.memo.id}
            memo={memoEditModal.memo}
            editable
            handlePreProcess={closeMemoEditModal}
          />
        </div>
      </div>
    </Modal>
  );
};

export default MemoEditModal;
