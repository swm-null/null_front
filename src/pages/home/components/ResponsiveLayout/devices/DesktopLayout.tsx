import { ReactNode } from 'react';
import { AnimationScope, motion } from 'framer-motion';
import { SideBar, SideBarOpenCloseButton } from 'pages/home/sidebar';
import { SIDEBAR_HEADER_ANIMATION_DURATION } from 'pages/home/constants';

interface DesktopLayoutProps {
  isOpen: boolean;
  onOpenButtonClick: (toggle: boolean) => void;
  setCurrentPage: (page: string) => void;
  children: ReactNode;
  scope: AnimationScope<any>;
}

const DesktopLayout = ({
  isOpen,
  onOpenButtonClick,
  setCurrentPage,
  children,
  scope,
}: DesktopLayoutProps) => {
  return (
    <div ref={scope} className="flex w-full h-full">
      <SideBarOpenCloseButton handleClick={() => onOpenButtonClick(!isOpen)} />
      <div className="z-10">
        <SideBar setCurrentPage={setCurrentPage} />
      </div>
      <motion.div
        className="flex flex-col h-screen overflow-x-hidden z-20 bg-white"
        animate={{ width: isOpen ? 'calc(100vw - 250px)' : '100vw' }}
        initial={{ width: isOpen ? 'calc(100vw - 250px)' : '100vw' }}
        transition={{ duration: SIDEBAR_HEADER_ANIMATION_DURATION }}
        style={{ position: 'absolute', right: 0, top: 0, bottom: 0 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default DesktopLayout;
