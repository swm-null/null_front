import { useEffect } from 'react';
import { Dialog } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  message: string;
  onClose: () => void;
  open: boolean; // 다이얼로그 열림 상태를 나타내는 props
}

const Alert = ({ message, onClose, open }: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          '@media (max-width:600px)': {
            width: '90%',
          },
          '@media (min-width:600px)': {
            width: '400px',
          },
        },
      }}
    >
      <div className="relative w-full p-5 rounded-lg shadow-lg flex flex-col gap-5">
        <p className="text-lg font-bold">{t('utils.service.name')}</p>
        <p className="text-sm">{message}</p>
        <button className="ml-auto px-3 py-1 text-sm" onClick={onClose}>
          {t('utils.alert.ok')}
        </button>
      </div>
    </Dialog>
  );
};

export default Alert;
