import { BottomNavBar } from './BottomNavBar';
import { LeftNavBar } from './LeftNavBar';

interface NavigationBarProps {
  isSmallScreen: boolean;
  bottomNavRef: React.RefObject<HTMLDivElement>;
  setCurrentPage: (page: string) => void;
}

const NavigationBar = ({
  isSmallScreen,
  bottomNavRef,
  setCurrentPage,
}: NavigationBarProps) => {
  const currentPage = window.location.pathname.split('/').pop() || '';

  return isSmallScreen ? (
    <BottomNavBar
      currentPage={currentPage}
      bottomNavRef={bottomNavRef}
      setCurrentPage={setCurrentPage}
    />
  ) : (
    <LeftNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
  );
};

export default NavigationBar;
