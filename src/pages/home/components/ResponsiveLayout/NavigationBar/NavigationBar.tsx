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
    <LeftNavBar setCurrentPage={setCurrentPage} />
  );
};

export default NavigationBar;
