import { ReactNode, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { ProfileButton } from './ProfileButton';
import { NavigationBar } from './NavigationBar';
import { LogoIcon } from 'assets/icons';

const MOBILE_DEVICE_WIDTH = 770;

const ResponsiveLayout = ({
  children,
  handleNavigation,
}: {
  children: ReactNode;
  handleNavigation: (page: string) => void;
}) => {
  const bottomNavRef = useRef<HTMLDivElement | null>(null);
  // TODO: bottomNavHeight 왠지 페이지에 전달해서 안에서 직접 padding 조절해야할 것 같아서 킵
  const [_, setBottomNavHeight] = useState(0);
  const isSmallScreen = useMediaQuery({
    query: `(max-width:${MOBILE_DEVICE_WIDTH}px)`,
  });

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
        <div
          className={`flex w-full ${isSmallScreen ? 'py-4' : 'py-5'} pl-4 pr-6 items-center`}
        >
          <LogoIcon
            className={`${isSmallScreen ? 'h-10' : 'h-14'} w-auto mr-auto`}
          />
          <ProfileButton />
        </div>
        <div className={`flex-grow overflow-auto ${isSmallScreen ? '' : 'px-20'}`}>
          {children}
        </div>
      </div>
      <NavigationBar
        isSmallScreen={isSmallScreen}
        bottomNavRef={bottomNavRef}
        setCurrentPage={handleNavigation}
      />
    </div>
  );
};

export default ResponsiveLayout;
