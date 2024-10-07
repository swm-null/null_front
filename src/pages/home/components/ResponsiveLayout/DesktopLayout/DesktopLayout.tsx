import { ReactNode } from 'react';
import { LeftNavBar } from './LeftNavBar';
import { ProfileButton } from '../ProfileButton';

interface DesktopLayoutProps {
  setCurrentPage: (page: string) => void;
  children: ReactNode;
}

const DesktopLayout = ({ setCurrentPage, children }: DesktopLayoutProps) => {
  return (
    <div className="flex w-full h-full">
      <div className="flex overflow-x-hidden z-20 items-center justify-center self-center">
        <LeftNavBar setCurrentPage={setCurrentPage} />
      </div>
      <div
        className="flex flex-col h-screen overflow-x-hidden z-10"
        style={{ position: 'absolute', right: 0, top: 0, bottom: 0, left: 0 }}
      >
        <div className="absolute top-0 right-0 m-4 z-30">
          <ProfileButton />
        </div>
        {children}
      </div>
    </div>
  );
};

export default DesktopLayout;
