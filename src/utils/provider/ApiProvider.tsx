import { useContext, ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AlertDialog, AlertContext, ApiContext } from 'utils';
import { authApi, getNewAccessToken, isTokenValid, refreshableApi } from 'api';

const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { alert } = useContext(AlertContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const alertedRef = useRef(false);

  const alertLoginRequiredThenRedirect = () => {
    if (!alertedRef.current) {
      alertedRef.current = true;
      alert(t('utils.auth.loginRequired')).then(() => {
        navigate('/login');
        alertedRef.current = false;
      });
    }
  };

  const checkTokenFromCookie = async () => {
    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');
    if (!accessToken && !refreshToken) {
      alertLoginRequiredThenRedirect();
    }

    if (refreshToken) {
      try {
        if (!accessToken || !isTokenValid(accessToken)) {
          await getNewAccessToken(refreshToken);
        }
      } catch (error) {
        alertLoginRequiredThenRedirect();
      }
    }
  };

  return (
    <ApiContext.Provider value={{ authApi, refreshableApi, checkTokenFromCookie }}>
      {children}
      <AlertDialog />
    </ApiContext.Provider>
  );
};

export default ApiProvider;
