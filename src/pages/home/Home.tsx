import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ResponsiveLayout } from './components';
import { useNavigate } from 'react-router-dom';
import { HomeRouter } from './router';
import { useContext, useEffect } from 'react';
import {
  ApiContext,
  BottomNavProvider,
  CreateResetContext,
  DashboardResetContext,
  SSEContext,
  TagProvider,
} from 'utils';
import 'flickity/css/flickity.css';
import { API_BASE_URL } from 'api/utils';

const queryClient = new QueryClient();

const Home = () => {
  const { connect, disconnect } = useContext(SSEContext);
  const { checkTokenFromCookie } = useContext(ApiContext);
  const { onReset: onCreateReset } = useContext(CreateResetContext);
  const { onReset: onDashboardReset } = useContext(DashboardResetContext);
  const navigate = useNavigate();

  const handleNavigation = (page: string) => {
    navigate(`/${page}`);
  };

  useEffect(() => {
    checkTokenFromCookie();
    connect(`${API_BASE_URL}/sse/subscribe`, onCreateReset, onDashboardReset);

    return () => {
      disconnect();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BottomNavProvider>
        <TagProvider>
          <ResponsiveLayout handleNavigation={handleNavigation}>
            <HomeRouter />
          </ResponsiveLayout>
        </TagProvider>
      </BottomNavProvider>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
};

export default Home;
