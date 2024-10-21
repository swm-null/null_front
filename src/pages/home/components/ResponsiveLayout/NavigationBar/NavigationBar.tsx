import { useContext } from 'react';
import { BottomNavBar } from './BottomNavBar';
import { LeftNavBar } from './LeftNavBar';
import { BottomNavContext } from 'utils';

interface NavigationBarProps {
  bottomNavRef: React.RefObject<HTMLDivElement>;
  setCurrentPage: (page: string) => void;
}

const NavigationBar = ({ bottomNavRef, setCurrentPage }: NavigationBarProps) => {
  const currentPage = window.location.pathname.split('/').pop() || '';
  const { isSmallScreen } = useContext(BottomNavContext);

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
