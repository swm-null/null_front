import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ResponsiveLayout } from './components';
import { useNavigate } from 'react-router-dom';
import { HomeRouter } from './router';

const queryClient = new QueryClient();

const Home = () => {
  const navigate = useNavigate();

  const handleNavigation = (page: string) => {
    navigate(`/${page}`);
  };

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
