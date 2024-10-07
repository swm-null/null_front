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
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '0.75rem',
            },
          }}
          fullWidth
        >
          <AlarmContent
            title={t('utils.service.name')}
            message={alertState!.message}
            confirmBtnText={t('utils.alert.ok')}
            cancelBtnText={t('utils.alert.cancel')}
            onClose={alertState!.onClose}
            onConfirm={alertState!.onConfirm}
          />
        </Dialog>
      )}
    </>
  );
};

interface AlarmContentProps {
  title: string;
  message: string;
  confirmBtnText: string;
  cancelBtnText: string;
  onConfirm: () => void;
  onClose?: () => void;
}

const AlarmContent = ({
  title,
  message,
  confirmBtnText,
  cancelBtnText,
  onClose,
  onConfirm,
}: AlarmContentProps) => {
  return (
    <div className="relative w-full p-5 shadow-custom flex flex-col gap-5 sm:w-400px">
      <p className="text-lg font-bold">{title}</p>
      <p className="text-sm">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-3 py-1 text-sm bg-[#F4CDB1] border-[#F4CDB1] border rounded"
          onClick={onConfirm}
        >
          {confirmBtnText}
        </button>
        {onClose && (
          <button
            type="button"
            className="px-3 py-1 text-sm border border-black border-opacity-10 bg-clip-padding rounded"
            onClick={onClose}
          >
            {cancelBtnText}
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertDialog;
