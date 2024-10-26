import { Modal } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { DashboardModalContext } from 'utils';
import { ModalContent } from './ModalContent';
import { useTagManager } from 'pages/home/subPages/components';

const TagEditModal = () => {
  const { tagEditModal, closeTagEditModal } = useContext(DashboardModalContext);
  const [newTagName, setTagName] = useState(tagEditModal?.tag.name || '');

  const { handleUpdateTag } = useTagManager();

  useEffect(() => {
    if (tagEditModal?.tag) {
      setTagName(tagEditModal?.tag.name);
    }
  }, [tagEditModal?.tag]);

  if (!tagEditModal) return <></>;

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Modal open={tagEditModal.isOpen} onClose={closeTagEditModal}>
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        onClick={closeTagEditModal}
      >
        <div
          className="flex bg-[#FFF6E3] border rounded-md w-full max-w-[400px] min-h-[200px] overflow-hidden shadow-custom backdrop-blur-lg"
          onClick={handleContentClick}
        >
          <ModalContent
            newTagName={newTagName}
            setNewTagName={setTagName}
            handleClose={closeTagEditModal}
            handleEdit={() => {
              closeTagEditModal();
              handleUpdateTag({
                id: tagEditModal.tag.id,
                name: newTagName,
              });
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default TagEditModal;
