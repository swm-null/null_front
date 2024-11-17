import { Modal } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ModalContent } from './ModalContent';
import { useTagManager } from 'pages/home/subPages/components';
import { TagContext } from 'utils';
import { useClickWithoutDrag } from 'pages/hooks';

const TagEditModal = () => {
  const { tagModal, closeTagModal } = useContext(TagContext);
  const { handleMouseDown, handleMouseMove, handleClick } =
    useClickWithoutDrag(closeTagModal);

  const [newTagName, setTagName] = useState('');

  const { handleUpdateTag } = useTagManager();

  useEffect(() => {
    setTagName(tagModal?.inputTagName || '');
  }, [tagModal?.inputTagName]);

  if (!tagModal) return <></>;

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Modal open={tagModal.isOpen} onClose={closeTagModal}>
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <div
          className="flex bg-[#FFF6E3] border rounded-md w-full max-w-[400px] min-h-[200px] overflow-hidden shadow-custom backdrop-blur-lg"
          onClick={handleContentClick}
        >
          <ModalContent
            title={tagModal.title}
            newTagName={newTagName}
            setNewTagName={setTagName}
            handleClose={closeTagModal}
            handleEdit={() => {
              closeTagModal();
              if (tagModal.tag)
                handleUpdateTag({
                  id: tagModal.tag.id,
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
