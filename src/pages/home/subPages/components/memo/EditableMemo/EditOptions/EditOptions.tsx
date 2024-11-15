import { ImageFileInput } from 'pages/home/subPages/components';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TagRebuildCheckbox } from './TagRebuildCheckbox';

const EditOptions = ({
  handleImageFilesChange,
  handleAddImageButtonClick,
  handleUpdateMemoWithUploadFiles,
}: {
  handleImageFilesChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleAddImageButtonClick: () => void;
  handleUpdateMemoWithUploadFiles: () => void;
}) => {
  const { t } = useTranslation();

  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-wrap gap-2">
      <ImageFileInput
        className="flex gap-4 flex-shrink-0 "
        handleImageFileChange={handleImageFilesChange}
      >
        <AddAPhotoOutlinedIcon
          sx={{ width: 20, height: 20 }}
          className="text-brown2 cursor-pointer"
          onClick={handleAddImageButtonClick}
        />
      </ImageFileInput>
      <div className="flex ml-auto w-fit gap-6 items-center">
        <TagRebuildCheckbox checked={checked} setChecked={setChecked} />
        <button
          type="button"
          className="flex h-8 items-center text-brown2 font-medium text-sm px-[27px] py-[3px] 
              rounded-[30px] border border-[#917360]"
          onClick={handleUpdateMemoWithUploadFiles}
        >
          {t('memo.save')}
        </button>
      </div>
    </div>
  );
};

export default EditOptions;
