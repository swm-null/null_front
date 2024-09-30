import { useState, useEffect, useCallback, ReactNode } from 'react';
import { Dialog } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AlertContext } from 'utils/context';

type AlertState = {
  message: string;
  onClose: () => void;
};

const AlertDialog = ({ children }: { children: ReactNode }) => {
  const [alertState, setAlertState] = useState<AlertState | null>(null);
  const { t } = useTranslation();
  const isOpen = Boolean(alertState);

  const alert = (message?: string): Promise<undefined> =>
    new Promise((resolve) => {
      setAlertState({
        message: message || '',
        onClose: () => {
          setAlertState(null);
          resolve(undefined);
        },
      });
    });

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && alertState) {
        alertState.onClose();
      }
    },
    [alertState]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleEscape]);

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
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
    </AlertContext.Provider>
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
    <div className="relative w-full p-5 rounded-lg shadow-lg flex flex-col gap-5 sm:w-400px">
      <p className="text-lg font-bold">{title}</p>
      <p className="text-sm">{message}</p>
      <button className="ml-auto px-3 py-1 text-sm" onClick={onClose}>
        {closeBtnText}
      </button>
    </div>
  );
};

export default AlertDialog;
