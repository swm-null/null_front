import { AnimationScope, motion } from 'framer-motion';
import { SIDEBAR_HEADER_ANIMATION_DURATION } from 'pages/home/constants';
import { SideBar, SideBarOpenCloseButton } from 'pages/home/sidebar';
import { ReactNode } from 'react';

interface MobileHomeProps {
  isOpen: boolean;
  onOpenButtonClick: (toggle: boolean) => void;
  setCurrentPage: (page: string) => void;
  children: ReactNode;
  scope: AnimationScope<any>;
}

export const MobileHome = ({
  isOpen,
  onOpenButtonClick,
  setCurrentPage,
  children,
  scope,
}: MobileHomeProps) => {
  return (
    <div ref={scope} className="flex w-full h-full">
      <SideBarOpenCloseButton handleClick={() => onOpenButtonClick(!isOpen)} />
      <motion.div
        className="overflow-x-hidden z-20"
        animate={{ width: isOpen ? '250px' : '0' }}
        initial={{ width: isOpen ? '250px' : '0' }}
        transition={{ duration: SIDEBAR_HEADER_ANIMATION_DURATION }}
        style={{ position: 'absolute', left: 0, top: 0, bottom: 0 }}
      >
        <SideBar setCurrentPage={setCurrentPage} />
      </motion.div>
      <div
        className="flex flex-col h-screen overflow-x-hidden z-10"
        style={{ position: 'absolute', right: 0, top: 0, bottom: 0, left: 0 }}
      >
        {children}
        {/* 불투명한 배경을 클릭했을 때 메뉴바 닫기 */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          onClick={() => onOpenButtonClick(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{
            duration: SIDEBAR_HEADER_ANIMATION_DURATION,
          }}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
        />
      </div>
    </div>
  );
};
