import { useEffect, useState } from 'react';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { useSideBarOpenCloseButtonAnimation } from 'pages/home/sidebar';
import { DesktopLayout, MobileLayout } from './devices';
import { PageRouter } from './PageRouter';
import { useNavigate } from 'react-router-dom';

const MOBILE_DEVICE_WIDTH = 770;
const HomeLayout = () => {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.innerWidth <= MOBILE_DEVICE_WIDTH
  );
  const [isOpen, setIsOpen] = useState(true);
  const scope = useSideBarOpenCloseButtonAnimation(isOpen);
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

      if (nowScreen) {
        setIsOpen(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return isSmallScreen ? (
    <MobileLayout
      isOpen={isOpen}
      onOpenButtonClick={setIsOpen}
      scope={scope}
      setCurrentPage={handleNavigation}
    >
      <PageRouter
        isOpen={isOpen}
        useHeaderAnimation={false}
        setCurrentPage={handleNavigation}
      />
    </MobileLayout>
  ) : (
    <DesktopLayout
      isOpen={isOpen}
      onOpenButtonClick={setIsOpen}
      scope={scope}
      setCurrentPage={handleNavigation}
    >
      <PageRouter
        isOpen={isOpen}
        useHeaderAnimation={true}
        setCurrentPage={handleNavigation}
      />
    </DesktopLayout>
  );
};

export default HomeLayout;
