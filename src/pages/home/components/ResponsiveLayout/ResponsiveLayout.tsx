import { ReactNode, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { ProfileButton } from './ProfileButton';
import { NavigationBar } from './NavigationBar';

const MOBILE_DEVICE_WIDTH = 770;

const ResponsiveLayout = ({
  children,
  handleNavigation,
}: {
  children: ReactNode;
  handleNavigation: (page: string) => void;
}) => {
  const bottomNavRef = useRef<HTMLDivElement | null>(null);
  const [bottomNavHeight, setBottomNavHeight] = useState(0);
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
      <ProfileButton />
      <div
        className={`flex-grow overflow-y-auto absolute right-0 top-0 left-0`}
        style={{
          bottom: isSmallScreen ? bottomNavHeight : 0,
        }}
      >
        {children}
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
