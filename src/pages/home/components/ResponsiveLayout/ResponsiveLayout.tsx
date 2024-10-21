import { ReactNode, useContext, useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import { ProfileButton } from './ProfileButton';
import { NavigationBar } from './NavigationBar';
import { LogoIcon } from 'assets/icons';
import { BottomNavContext } from 'utils';

const MOBILE_DEVICE_WIDTH = 770;

const ResponsiveLayout = ({
  children,
  handleNavigation,
}: {
  children: ReactNode;
  handleNavigation: (page: string) => void;
}) => {
  const bottomNavRef = useRef<HTMLDivElement | null>(null);
  const { setBottomNavHeight, setIsSmallScreen } = useContext(BottomNavContext);

  const isSmallScreen = useMediaQuery({
    query: `(max-width:${MOBILE_DEVICE_WIDTH}px)`,
  });

  useEffect(() => {
    setIsSmallScreen(isSmallScreen);
  }, [isSmallScreen]);

  useEffect(() => {
    if (bottomNavRef.current) {
      setBottomNavHeight(bottomNavRef.current.offsetHeight);
    }
  }, [bottomNavRef]);

  return (
    <div className="flex flex-col w-full h-full bg-custom-gradient-basic">
      <div
        className={`absolute top-0 left-0 right-0 bottom-0 overflow-auto h-full flex flex-col ${isSmallScreen ? '' : 'gap-4'}`}
      >
        <div className={`flex w-full py-5 pl-4 pr-6 items-center`}>
          <LogoIcon className="h-14 w-auto mr-auto" />
          <ProfileButton />
        </div>
        <div
          className={`flex-grow overflow-auto ${isSmallScreen ? '' : 'px-20 pb-10'}`}
        >
          {children}
        </div>
      </div>
      <NavigationBar bottomNavRef={bottomNavRef} setCurrentPage={handleNavigation} />
    </div>
  );
};

export default ResponsiveLayout;
