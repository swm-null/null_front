import { createContext } from 'react';

type ApiContextType = {
  authApi: any;
  refreshableApi: any;
  checkTokenFromCookieWithAlert: () => void;
};

const ApiContext = createContext<ApiContextType>({
  authApi: null,
  refreshableApi: null,
  checkTokenFromCookieWithAlert: () => {},
});

export default ApiContext;
