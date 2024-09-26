import { useEffect, useState } from 'react';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { useNavigate } from 'react-router-dom';
import { PageRouter } from './PageRouter';
import { MobileLayout } from './MobileLayout';
import { DesktopLayout } from './DesktopLayout';

const MOBILE_DEVICE_WIDTH = 770;
const ResponsiveLayout = () => {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.innerWidth <= MOBILE_DEVICE_WIDTH
  );
  const navigate = useNavigate();

  const handleNavigation = (page: string) => {
    navigate(`/${page}`);
  };

  useEffect(() => {
    const resize$ = fromEvent(window, 'resize').pipe(
      debounceTime(300),
      map(() => window.innerWidth <= MOBILE_DEVICE_WIDTH),
      distinctUntilChanged()
    );

    const subscription = resize$.subscribe((nowScreen) => {
      setIsSmallScreen(nowScreen);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return isSmallScreen ? (
    <MobileLayout setCurrentPage={handleNavigation}>
      <PageRouter setCurrentPage={handleNavigation} />
    </MobileLayout>
  ) : (
    <DesktopLayout setCurrentPage={handleNavigation}>
      <PageRouter setCurrentPage={handleNavigation} />
    </DesktopLayout>
  );
};

export default ResponsiveLayout;
