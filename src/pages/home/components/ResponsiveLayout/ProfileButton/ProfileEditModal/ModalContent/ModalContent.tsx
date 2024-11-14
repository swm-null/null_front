import { profile } from 'api';
import { oatmealUrl } from 'assets/images';
import { CustomInput } from 'pages/components';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import { ImageFileInput } from 'pages/home/subPages/components';
import { useTranslation } from 'react-i18next';
import { useImageList } from 'pages/home/subPages/hooks';

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
  const { images, handleAddImageButtonClick, handleImageFileChange } =
    useImageList();

  const imageUrl = images[0] ? URL.createObjectURL(images[0]) : null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(profileName, imageUrl);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base">{t('profile.editProfile')}</h2>
      <div className="flex flex-col items-center gap-4">
        <ImageFileInput
          className="relative"
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
            <AddAPhotoOutlinedIcon
              sx={{ width: 28, height: 28 }}
              className="border rounded-full shadow-md p-1 bg-white"
            />
          </button>
        </ImageFileInput>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-4">
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
            type="submit"
            className="btn-primary px-3 py-1 text-sm bg-[#F4CDB1] rounded"
          >
            {t('utils.alert.ok')}
          </button>
          <button
            type="button"
            className="btn-secondary px-3 py-1 text-sm bg-white border rounded"
            onClick={handleClose}
          >
            {t('utils.alert.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalContent;
