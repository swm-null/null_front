import { FC } from 'react';
import { BottomNavBar } from './BottomNavBar';
import { LeftNavBar } from './LeftNavBar';

interface NavigationBarProps {
  isSmallScreen: boolean;
  bottomNavRef: React.RefObject<HTMLDivElement>;
  setCurrentPage: (page: string) => void;
}

const NavigationBar: FC<NavigationBarProps> = ({
  isSmallScreen,
  bottomNavRef,
  setCurrentPage,
}) => {
  return isSmallScreen ? (
    <BottomNavBar bottomNavRef={bottomNavRef} setCurrentPage={setCurrentPage} />
  ) : (
    <div className="flex w-full h-full">
      <div className="flex overflow-x-hidden z-20 items-center justify-center self-center">
        <LeftNavBar setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default NavigationBar;
