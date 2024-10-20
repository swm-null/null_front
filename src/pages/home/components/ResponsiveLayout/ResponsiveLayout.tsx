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
  // bottomNavHeight 왠지 페이지에 전달해서 안에서 직접 padding 조절해야할 것 같아서 킵
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
        className={`absolute top-0 left-0 right-0 bottom-0 overflow-auto ${isSmallScreen ? 'pt-[1.19rem]' : 'pt-[4rem]'}`}
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
