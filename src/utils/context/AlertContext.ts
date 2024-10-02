import { createContext } from 'react';

type AlertState = {
  message: string;
  onClose: () => void;
};

type Type = {
  alert: (message?: string) => Promise<undefined>;
  alertState: AlertState | null;
};

const AlertContext = createContext<Type>({
  alert: () => new Promise((_, reject) => reject()),
  alertState: null,
});

export default AlertContext;
