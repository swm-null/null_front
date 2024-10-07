import { createContext } from 'react';

type AlertState = {
  message: string;
  onConfirm: () => void;
  onClose?: () => void;
};

type Type = {
  alert: (message?: string) => Promise<undefined>;
  confirmAlert: (message?: string) => Promise<boolean>;
  alertState: AlertState | null;
};

const AlertContext = createContext<Type>({
  alert: () => new Promise((_, reject) => reject()),
  confirmAlert: () => new Promise((_, reject) => reject()),
  alertState: null,
});

export default AlertContext;
