import { useContext, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Cookies from 'js-cookie';
import { ResponsiveLayout } from './components';
import { useNavigate } from 'react-router-dom';
import { HomeRouter } from './router';
import { jwtDecode } from 'jwt-decode';
import { AlertContext } from 'utils/context';
import { useTranslation } from 'react-i18next';

const queryClient = new QueryClient();

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { alert } = useContext(AlertContext);

  const onAlertClick = async (message: string, page: string) => {
    await alert(message);
    handleNavigation(page);
  };

  const handleNavigation = (page: string) => {
    navigate(`/${page}`);
  };

  useEffect(() => {
    const accessToken = Cookies.get('access_token');

    interface TokenPayload {
      exp: number;
      iat: number;
    }

    const isTokenValid = (token: string) => {
      if (!token) return false;

      const decoded = jwtDecode<TokenPayload>(token);
      const currentTime = Date.now() / 1000;

      return decoded.exp > currentTime;
    };

    if (!accessToken) {
      onAlertClick(t('utils.auth.loginRequired'), 'login');
    } else if (!isTokenValid(accessToken)) {
      onAlertClick(t('utils.auth.sessionExpired'), 'login');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ResponsiveLayout handleNavigation={handleNavigation}>
        <HomeRouter setCurrentPage={handleNavigation} />
      </ResponsiveLayout>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
};

export default Home;
