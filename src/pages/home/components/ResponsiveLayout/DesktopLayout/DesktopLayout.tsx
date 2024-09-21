import { ReactNode } from 'react';
import { LeftSideBar } from './LeftSideBar';

interface DesktopLayoutProps {
  setCurrentPage: (page: string) => void;
  children: ReactNode;
}

const DesktopLayout = ({ setCurrentPage, children }: DesktopLayoutProps) => {
  return (
    <div className="flex w-full h-full">
      <div
        className="overflow-x-hidden z-20 items-center justify-center"
        style={{ position: 'absolute', left: 0, top: 0, bottom: 0 }}
      >
        <LeftSideBar setCurrentPage={setCurrentPage} />
      </div>
      <div
        className="flex flex-col h-screen overflow-x-hidden z-10"
        style={{ position: 'absolute', right: 0, top: 0, bottom: 0, left: 0 }}
      >
        {children}
      </div>
    </div>
  );
};

export default DesktopLayout;
