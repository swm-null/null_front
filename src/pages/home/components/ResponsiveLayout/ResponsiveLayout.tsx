import { ReactNode, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { BottomNavBar } from './BottomNavBar';
import { ProfileButton } from './ProfileButton';
import { LeftNavBar } from './LeftNavBar';

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
    if (!bottomNavRef.current) return;
    setBottomNavHeight(bottomNavRef.current?.offsetHeight);
  }, [bottomNavRef]);

  return (
    <div className="flex flex-col w-full h-full bg-custom-gradient-basic">
      {!isSmallScreen && (
        <div className="flex w-full h-full">
          <div className="flex overflow-x-hidden z-20 items-center justify-center self-center">
            <LeftNavBar setCurrentPage={handleNavigation} />
          </div>
        </div>
      )}
      <div
        className="flex-grow overflow-y-auto"
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: isSmallScreen ? bottomNavHeight : 0,
          left: 0,
        }}
      >
        <div className="absolute top-0 right-0 m-4 z-30">
          <ProfileButton />
        </div>
        {children}
      </div>
      {isSmallScreen && (
        <BottomNavBar
          bottomNavRef={bottomNavRef}
          setCurrentPage={handleNavigation}
        />
      )}
    </div>
  );
};

export default ResponsiveLayout;
