import { ImageFileInput } from 'pages/home/subPages/components';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { TagRebuildCheckbox } from './TagRebuildCheckbox';
import { CameraIcon, MicIcon } from 'assets/icons';

const EditOptions = ({
  tagRebuild,
  setTagRebuild,
  handleImageFilesChange,
  handleUpdateMemoWithUploadFiles,
}: {
  tagRebuild: boolean;
  setTagRebuild: (tagRebuild: boolean) => void;
  handleImageFilesChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleUpdateMemoWithUploadFiles: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2">
      <ImageFileInput
        className="flex gap-4 flex-shrink-0 "
        onFileChange={handleImageFilesChange}
      >
        <CameraIcon className="w-6 h-6 p-[2px] text-brown2 cursor-pointer" />
      </ImageFileInput>
      <MicIcon className="w-6 h-6 text-brown2 " />
      <div className="flex ml-auto w-fit gap-6 items-center">
        <TagRebuildCheckbox checked={tagRebuild} setChecked={setTagRebuild} />
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
