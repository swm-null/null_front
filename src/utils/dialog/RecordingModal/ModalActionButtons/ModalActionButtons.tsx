import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface ModalActionButtonsProps {
  disabled: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  onUpload: () => void;
}

const ModalActionButtons = ({
  disabled,
  onSubmit,
  onClose,
  onUpload,
}: ModalActionButtonsProps) => {
  const { t } = useTranslation();

  return (
    <form className="flex justify-end mt-4 gap-2" onSubmit={onSubmit}>
      <button
        type="button"
        onClick={onUpload}
        className="btn-secondary px-3 py-1 text-sm bg-white border rounded mr-auto"
      >
        {t('voice.upload')}
      </button>
      <button
        type="submit"
        className="btn-primary px-3 py-1 text-sm bg-[#F4CDB1] rounded disabled:opacity-50"
        disabled={disabled}
      >
        {t('voice.save')}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="btn-secondary px-3 py-1 text-sm bg-white border rounded"
      >
        {t('voice.cancel')}
      </button>
    </form>
  );
};

export default ModalActionButtons;
