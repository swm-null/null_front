import { ReactNode } from 'react';
import { BottomNavBar } from './BottomNavBar';
import { ProfileButton } from '../ProfileButton';

interface MobileLayoutProps {
  setCurrentPage: (page: string) => void;
  children: ReactNode;
}

const MobileLayout = ({ setCurrentPage, children }: MobileLayoutProps) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-grow overflow-y-auto">
        <div className="absolute top-0 right-0 m-4 z-30">
          <ProfileButton />
        </div>
        {children}
      </div>
      <BottomNavBar setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default MobileLayout;
