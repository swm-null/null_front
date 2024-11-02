import { useContext, useEffect, useState } from 'react';
import { Modal } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { profile } from 'api';
import { oatmealUrl } from 'assets/images';
import { CustomInput } from 'pages/components';
import { ImageListContext } from 'utils';
import { FileInput } from 'pages/home/subPages/components';

interface ProfileEditModalProps {
  isOpen: boolean;
  handleClose: () => void;
  userProfile: profile;
  onSave: (newName: string, newImage: string) => void;
}

const ProfileEditModal = ({
  isOpen,
  handleClose,
  userProfile,
  onSave,
}: ProfileEditModalProps) => {
  const { t } = useTranslation();
  const [profileName, setProfileName] = useState<string>(userProfile.name);
  const [profileImage, setProfileImage] = useState<string>(
    userProfile.profileImageUrl
  );
  const {
    images,
    ALLOWED_IMAGE_FILE_TYPES,
    removeAllImage,
    handleAddImageButtonClick,
    handleImageFileChange,
  } = useContext(ImageListContext);

  const imageUrl = images.length !== 0 ? URL.createObjectURL(images[0]) : null;

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
        onClick={handleClose}
      >
        <div
          className="flex flex-col bg-[#FFF6E3] border rounded-md w-full max-w-[400px] min-h-[300px] p-4 shadow-custom"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="mb-2 text-base">{t('profile.editProfile')}</p>
          <div className="flex flex-col items-center gap-4">
            <FileInput
              ALLOWED_FILE_TYPES={ALLOWED_IMAGE_FILE_TYPES}
              handleImageFileChange={handleImageFileChange}
            >
              <img
                src={imageUrl || profileImage || oatmealUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full border object-cover"
                onClick={handleAddImageButtonClick}
              />
            </FileInput>
            <CustomInput
              label={t('signup.name')}
              value={profileName}
              setValue={setProfileName}
            />
            <CustomInput
              label={t('signup.email')}
              value={userProfile.email}
              setValue={(_) => {}}
              editable={false}
            />
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <button
              type="button"
              className="px-3 py-1 text-sm bg-[#F4CDB1] border-[#F4CDB1] border rounded"
              onClick={() => {
                onSave(profileName, profileImage);
              }}
            >
              {t('utils.alert.ok')}
            </button>
            <button
              type="button"
              className="px-3 py-1 text-sm border bg-white border-black border-opacity-10 bg-clip-padding rounded"
              onClick={handleClose}
            >
              {t('utils.alert.cancel')}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileEditModal;
