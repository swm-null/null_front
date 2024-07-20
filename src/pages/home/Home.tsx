import { useEffect, useState } from 'react';
import { useSideBarOpenCloseButtonAnimation } from 'pages/home/sidebar';
import { DesktopHome, MobileHome } from './components';
import { AddPage, DashboardPage, SearchPage } from './contents';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const MOBILE_DEVICE_WIDTH = 770;

export const Home = () => {
  const [currentPage, setCurrentPage] = useState<string>('add');
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.innerWidth <= 770
  );
  const [isOpen, setIsOpen] = useState(true);
  const scope = useSideBarOpenCloseButtonAnimation(isOpen);

  const pageContent = ({
    useHeaderAnimation,
  }: {
    useHeaderAnimation: boolean;
  }) => {
    const commonProps = {
      headerLeftMarginToggle: useHeaderAnimation ? !isOpen : true,
      headerLeftMargin: 48,
    };

    switch (currentPage) {
      case 'add':
        return <AddPage {...commonProps} />;
      case 'search':
        return <SearchPage {...commonProps} />;
      case 'dashboard':
        return <DashboardPage {...commonProps} />;
      default:
        return <AddPage {...commonProps} />;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      // 작은 화면인지 확인하고 수정
      const nowScreen = window.innerWidth <= MOBILE_DEVICE_WIDTH;
      if (nowScreen != isSmallScreen) {
        setIsSmallScreen(nowScreen);

        // 큰 화면 -> 작은 화면으로 전환될 때, 사이드바 닫기
        if (isSmallScreen) {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {isSmallScreen ? (
        <MobileHome
          isOpen={isOpen}
          onOpenButtonClick={setIsOpen}
          setCurrentPage={setCurrentPage}
          scope={scope}
        >
          {pageContent({ useHeaderAnimation: false })}
        </MobileHome>
      ) : (
        <DesktopHome
          isOpen={isOpen}
          onOpenButtonClick={setIsOpen}
          setCurrentPage={setCurrentPage}
          scope={scope}
        >
          {pageContent({ useHeaderAnimation: true })}
        </DesktopHome>
      )}
    </QueryClientProvider>
  );
};
