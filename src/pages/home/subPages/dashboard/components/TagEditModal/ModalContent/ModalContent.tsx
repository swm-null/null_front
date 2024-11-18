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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleEdit();
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
          onChange={(e) => setNewTagName(e.target.value)}
          className="p-2 rounded-lg border w-full focus:outline-none focus:ring text-sm"
        />
      </div>
      <div className="flex justify-end mt-auto gap-2">
        <button
          type="submit"
          className="px-3 py-1 text-sm bg-[#F4CDB1] border-[#F4CDB1] border rounded"
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
