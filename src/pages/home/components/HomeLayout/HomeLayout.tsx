import { useEffect, useState } from 'react';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { useSideBarOpenCloseButtonAnimation } from 'pages/home/sidebar';
import { DesktopHome, MobileHome } from './devices';
import { PageContents } from './PageContents';

const MOBILE_DEVICE_WIDTH = 770;
const HomeLayout = () => {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.innerWidth <= MOBILE_DEVICE_WIDTH
  );
  const [isOpen, setIsOpen] = useState(true);
  const scope = useSideBarOpenCloseButtonAnimation(isOpen);
  const [currentPage, setCurrentPage] = useState<string>('main');

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
    <MobileHome
      isOpen={isOpen}
      onOpenButtonClick={setIsOpen}
      scope={scope}
      setCurrentPage={setCurrentPage}
    >
      <PageContents
        isOpen={isOpen}
        useHeaderAnimation={false}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </MobileHome>
  ) : (
    <DesktopHome
      isOpen={isOpen}
      onOpenButtonClick={setIsOpen}
      scope={scope}
      setCurrentPage={setCurrentPage}
    >
      <PageContents
        isOpen={isOpen}
        useHeaderAnimation={true}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </DesktopHome>
  );
};

export default HomeLayout;
