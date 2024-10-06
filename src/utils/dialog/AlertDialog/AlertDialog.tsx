import { useContext } from 'react';
import { Dialog } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AlertContext } from 'utils/context';

const AlertDialog = () => {
  const { alertState } = useContext(AlertContext);
  const { t } = useTranslation();
  const isOpen = Boolean(alertState);

  return (
    <>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={alertState!.onClose}
          maxWidth="sm"
          fullWidth
        >
          <AlarmContent
            title={t('utils.service.name')}
            message={alertState!.message}
            closeBtnText={t('utils.alert.ok')}
            onClose={alertState!.onClose}
          />
        </Dialog>
      )}
    </>
  );
};

interface AlarmContentProps {
  title: string;
  message: string;
  closeBtnText: string;
  onClose: () => void;
}

const AlarmContent = ({
  title,
  message,
  closeBtnText,
  onClose,
}: AlarmContentProps) => {
  return (
    <div className="relative w-full p-5 rounded-lg shadow-custom backdrop-blur-lg flex flex-col gap-5 sm:w-400px">
      <p className="text-lg font-bold">{title}</p>
      <p className="text-sm">{message}</p>
      <button className="ml-auto px-3 py-1 text-sm" onClick={onClose}>
        {closeBtnText}
      </button>
    </div>
  );
};

export default AlertDialog;
