import { profile } from 'api';
import { CameraIcon } from 'assets/icons';
import { oatmealUrl } from 'assets/images';
import { CustomInput } from 'pages/components';
import { FileInput } from 'pages/home/subPages/components';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageListContext } from 'utils';

const ModalContent = ({
  profileName,
  setProfileName,
  profileImage,
  userProfile,
  onSave,
  handleClose,
}: {
  profileName: string;
  setProfileName: (name: string) => void;
  profileImage: string;
  userProfile: profile;
  onSave: (name: string, image: string | null) => void;
  handleClose: () => void;
}) => {
  const { t } = useTranslation();
  const {
    images,
    ALLOWED_IMAGE_FILE_TYPES,
    handleAddImageButtonClick,
    handleImageFileChange,
  } = useContext(ImageListContext);

  const imageUrl = images[0] ? URL.createObjectURL(images[0]) : null;

  return (
    <>
      <h2 className="text-base mb-4">{t('profile.editProfile')}</h2>

      <div className="flex flex-col items-center gap-4">
        <FileInput
          className="relative"
          ALLOWED_FILE_TYPES={ALLOWED_IMAGE_FILE_TYPES}
          handleImageFileChange={handleImageFileChange}
          handleClick={handleAddImageButtonClick}
        >
          <img
            src={imageUrl || profileImage || oatmealUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full border object-cover cursor-pointer"
          />
          <button
            type="button"
            color="primary"
            aria-label="upload picture"
            className="absolute p-1 -bottom-1 -right-1 bg-[#FFF6E3] rounded-full"
          >
            <CameraIcon className="border rounded-full shadow-md p-1 w-7 h-7 bg-white" />
          </button>
        </FileInput>

        <CustomInput
          label={t('signup.name')}
          value={profileName}
          setValue={setProfileName}
        />
        <CustomInput
          label={t('signup.email')}
          value={userProfile.email}
          setValue={() => {}}
          editable={false}
        />
      </div>

      <div className="flex justify-end mt-4 gap-2">
        <button
          className="btn-primary px-3 py-1 text-sm bg-[#F4CDB1] rounded"
          onClick={() => onSave(profileName, imageUrl)}
        >
          {t('utils.alert.ok')}
        </button>
        <button
          className="btn-secondary px-3 py-1 text-sm bg-white border rounded"
          onClick={handleClose}
        >
          {t('utils.alert.cancel')}
        </button>
      </div>
    </>
  );
};

export default ModalContent;
