import { ReactNode, useEffect, useState } from 'react';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { MobileLayout } from './MobileLayout';
import { DesktopLayout } from './DesktopLayout';

const MOBILE_DEVICE_WIDTH = 770;
const ResponsiveLayout = ({
  children,
  handleNavigation,
}: {
  children: ReactNode;
  handleNavigation: (page: string) => void;
}) => {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.innerWidth <= MOBILE_DEVICE_WIDTH
  );

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
    <MobileLayout setCurrentPage={handleNavigation}>{children}</MobileLayout>
  ) : (
    <DesktopLayout setCurrentPage={handleNavigation}>{children}</DesktopLayout>
  );
};

export default ResponsiveLayout;
