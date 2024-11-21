import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ModalContent = ({
  title,
  newTagName,
  setNewTagName,
  handleClose,
  handleEdit,
}: {
  title: string;
  newTagName: string;
  setNewTagName: (newTagName: string) => void;
  handleClose: () => void;
  handleEdit: () => void;
}) => {
  const { t } = useTranslation();
  const [isValidTag, setIsValidTag] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleEdit();
  };

  const checkValidTag = (tag: string) => {
    return TAG_INVALID_CHARS_PATTERN.test(tag);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTagName(e.target.value);
    setIsValidTag(checkValidTag(e.target.value));
  };

  return (
    <form className="flex flex-col p-4 w-full flex-1" onSubmit={handleSubmit}>
      <p className="mb-2 text-base">{title}</p>
      <div className="w-full flex flex-col flex-1">
        <input
          type="text"
          id="tag"
          placeholder={t('pages.dashboard.tag.edit.placeholder')}
          value={newTagName}
          onChange={handleChange}
          className="p-2 rounded-lg border w-full focus:outline-none focus:ring text-sm"
        />
        <p className="p-1 text-xs text-gray2">
          태그 이름은 영어, 숫자, 한글, 언더바 및 공백만 허용되며, 최대 10자까지 입력
          가능합니다.
        </p>
      </div>
      <div className="flex justify-end mt-auto gap-2">
        <button
          type="submit"
          className={`px-3 py-1 text-sm bg-[#F4CDB1] border-[#F4CDB1] border rounded 
            disabled:bg-gray1 disabled:border-black disabled:border-opacity-10 disabled:text-gray2`}
          disabled={!isValidTag}
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
    </form>
  );
};

export default ModalContent;
