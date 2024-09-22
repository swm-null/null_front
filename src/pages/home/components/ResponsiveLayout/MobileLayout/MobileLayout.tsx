import { ReactNode } from 'react';
import { BottomNavBar } from './BottomNavBar';

interface MobileLayoutProps {
  setCurrentPage: (page: string) => void;
  children: ReactNode;
}

const MobileLayout = ({ setCurrentPage, children }: MobileLayoutProps) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-grow overflow-y-auto">{children}</div>
      <BottomNavBar setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default MobileLayout;
