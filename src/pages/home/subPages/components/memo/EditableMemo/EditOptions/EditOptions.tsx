import { ImageFileInput } from 'pages/home/subPages/components';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { TagRebuildCheckbox } from './TagRebuildCheckbox';
import { CameraIcon, MicIcon } from 'assets/icons';

const EditOptions = ({
  tagRebuildable = false,
  tagRebuild,
  setTagRebuild,
  handleImageFilesChange,
  handleMicButtonClick,
  handleSubmit,
}: {
  tagRebuildable: boolean;
  tagRebuild: boolean;
  setTagRebuild: (tagRebuild: boolean) => void;
  handleImageFilesChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleMicButtonClick: () => void;
  handleSubmit: () => void;
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
      <MicIcon className="w-6 h-6 text-brown2 " onClick={handleMicButtonClick} />
      <div className="flex ml-auto w-fit gap-6 items-center">
        {tagRebuildable && (
          <TagRebuildCheckbox checked={tagRebuild} setChecked={setTagRebuild} />
        )}
        <button
          type="button"
          className="flex h-8 items-center text-brown2 font-medium text-sm px-[27px] py-[3px] 
              rounded-[30px] border border-[#917360]"
          onClick={handleSubmit}
        >
          {t('memo.save')}
        </button>
      </div>
    </div>
  );
};

export default EditOptions;
