import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DesktopHome, MobileHome } from './components';
import { DashboardPage, SearchHistoryPage, UploadDataPage } from './contents';
import { useSideBarOpenCloseButtonAnimation } from './sidebar';
import { MainPage } from './contents/MainPage';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

const queryClient = new QueryClient();
const MOBILE_DEVICE_WIDTH = 770;

const Home = () => {
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
      case 'main':
        return (
          <MainPage navigateToHistory={() => setCurrentPage('searchHistory')} />
        );
      case 'searchHistory':
        return <SearchHistoryPage {...commonProps} />;
      case 'dashboard':
        return <DashboardPage {...commonProps} />;
      case 'uploadData':
        return <UploadDataPage {...commonProps} />;
      default:
        return (
          <MainPage navigateToHistory={() => setCurrentPage('searchHistory')} />
        );
    }
  };

  useEffect(() => {
    const resize$ = fromEvent(window, 'resize').pipe(
      debounceTime(300), // 300ms 지연 시간 설정
      map(() => window.innerWidth <= MOBILE_DEVICE_WIDTH),
      distinctUntilChanged() // 값이 변경되었을 때만 emit
    );

    const subscription = resize$.subscribe((nowScreen) => {
      setIsSmallScreen(nowScreen);

      // 큰 화면 -> 작은 화면으로 전환될 때, 사이드바 닫기
      if (nowScreen) {
        setIsOpen(false);
      }
    });

    // 컴포넌트가 언마운트될 때 이벤트 구독 해제
    return () => {
      subscription.unsubscribe();
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

export default Home;
