import { useTranslation } from 'react-i18next';

const ModalContent = ({
  newTagName,
  setNewTagName,
  handleClose,
  handleEdit,
}: {
  newTagName: string;
  setNewTagName: (newTagName: string) => void;
  handleClose: () => void;
  handleEdit: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col p-4 w-full flex-1">
      <p className="mb-2 text-base">{t('pages.dashboard.tagEdit.title')}</p>
      <div className="w-full flex flex-col flex-1">
        <input
          type="text"
          id="tag"
          placeholder={t('pages.dashboard.tagEdit.placeholder')}
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          className="p-2 rounded-lg border w-full focus:outline-none focus:ring text-sm"
        />
      </div>
      <div className="flex justify-end mt-auto gap-2">
        <button
          type="button"
          className="px-3 py-1 text-sm border bg-white border-black border-opacity-10 bg-clip-padding rounded"
          onClick={handleClose}
        >
          {t('utils.alert.cancel')}
        </button>
        <button
          type="button"
          className="px-3 py-1 text-sm bg-[#F4CDB1] border-[#F4CDB1] border rounded"
          onClick={handleEdit}
        >
          {t('utils.alert.ok')}
        </button>
      </div>
    </div>
  );
};

export default ModalContent;