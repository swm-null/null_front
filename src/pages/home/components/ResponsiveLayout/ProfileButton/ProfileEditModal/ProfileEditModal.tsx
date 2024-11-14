import { useEffect, useState } from 'react';
import { Modal } from '@mui/material';
import { profile } from 'api';
import { ModalContent } from './ModalContent';
import { useClickWithoutDrag } from 'pages/hooks';
import { useImageList } from 'pages/home/subPages/hooks';

interface ProfileEditModalProps {
  isOpen: boolean;
  handleClose: () => void;
  userProfile: profile;
  onSave: (newName: string, newImage: string | null) => void;
}

const ProfileEditModal = ({
  isOpen,
  handleClose,
  userProfile,
  onSave,
}: ProfileEditModalProps) => {
  const [profileName, setProfileName] = useState(userProfile.name);
  const [profileImage, setProfileImage] = useState(userProfile.profileImageUrl);

  const { handleMouseDown, handleMouseMove, handleClick } =
    useClickWithoutDrag(handleClose);

  const { removeAllImage } = useImageList();

  useEffect(() => {
    if (isOpen) {
      setProfileName(userProfile.name);
      setProfileImage(userProfile.profileImageUrl);
      removeAllImage();
    }
  }, [isOpen]);

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <div
          className="flex flex-col bg-[#FFF6E3] border rounded-md w-full max-w-[400px] min-h-[300px] p-4 shadow-custom"
          onClick={(e) => e.stopPropagation()}
        >
          <ModalContent
            profileName={profileName}
            profileImage={profileImage}
            onSave={onSave}
            handleClose={handleClose}
            setProfileName={setProfileName}
            userProfile={userProfile}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ProfileEditModal;
