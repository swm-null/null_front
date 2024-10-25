import { Modal } from '@mui/material';
import { editTag, isGetTagResponse } from 'api';
import { Tag } from 'pages/home/subPages/interfaces';
import { useContext, useEffect, useState } from 'react';
import { DashboardModalContext } from 'utils';
import { ModalContent } from './ModalContent';

const TagEditModal = ({
  updateTag,
  revertTag,
}: {
  updateTag: (tag: Tag) => void;
  revertTag: (tag: Tag) => void;
}) => {
  const { tagEditModal, closeTagEditModal } = useContext(DashboardModalContext);
  const [newTagName, setTagName] = useState(tagEditModal?.tag.name || '');

  useEffect(() => {
    if (tagEditModal?.tag) {
      setTagName(tagEditModal?.tag.name);
    }
  }, [tagEditModal?.tag]);

  if (!tagEditModal) return <></>;

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleEditTag = async () => {
    try {
      const prevTag = tagEditModal.tag;
      updateTag({ id: tagEditModal.tag.id, name: newTagName });

      const response = await editTag(tagEditModal.tag.id, newTagName);
      if (!isGetTagResponse(response)) {
        alert(response.exceptionMessage);
      } else {
        setTagName(newTagName);
        closeTagEditModal();
        revertTag(prevTag);
      }
    } catch {}
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
            handleEdit={handleEditTag}
          />
        </div>
      </div>
    </Modal>
  );
};

export default TagEditModal;
