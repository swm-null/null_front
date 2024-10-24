import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ResponsiveLayout } from './components';
import { useNavigate } from 'react-router-dom';
import { HomeRouter } from './router';
import { useContext, useEffect } from 'react';
import { ApiContext, BottomNavProvider } from 'utils';
import 'flickity/css/flickity.css';

const queryClient = new QueryClient();

const Home = () => {
  const { checkTokenFromCookie } = useContext(ApiContext);
  const navigate = useNavigate();

  const handleNavigation = (page: string) => {
    navigate(`/${page}`);
  };

  useEffect(() => {
    checkTokenFromCookie();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BottomNavProvider>
        <ResponsiveLayout handleNavigation={handleNavigation}>
          <HomeRouter setCurrentPage={handleNavigation} />
        </ResponsiveLayout>
      </BottomNavProvider>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
};

export default Home;
