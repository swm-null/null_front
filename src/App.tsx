import { useState } from 'react';
import { motion } from 'framer-motion';
import SideBar from './sidebar/SideBar';
import { SideBarOpenCloseButton } from './sidebar/SideBarOpenCloseButton';
import { useSideBarOpenCloseButtonAnimation } from './sidebar/useSideBarOpenCloseButtonAnimation';
import { AddPage, SearchPage } from './pages';
import { SIDEBAR_HEADER_ANIMATION_DURATION_SECOND } from 'constants/HeaderSideBarAnimation';

const App = () => {
  const [currentPage, setCurrentPage] = useState<string>('add');
  const [isOpen, setIsOpen] = useState(true);
  const scope = useSideBarOpenCloseButtonAnimation(isOpen);

  const renderContent = () => {
    switch (currentPage) {
      case 'add':
        return <AddPage headerLeftMarginToggle={!isOpen} />;
      case 'search':
        return <SearchPage headerLeftMarginToggle={!isOpen} />;
      default:
        return <AddPage headerLeftMarginToggle={!isOpen} />;
    }
  };

  // 화면이 큰 경우, 사이드바를 맨 뒤에 놓고, 페이지 화면의 width를 조절
  return (
    <div ref={scope} className="flex w-full h-full">
      <SideBar zIndex={10} setCurrentPage={setCurrentPage} />
      <SideBarOpenCloseButton handleClick={() => setIsOpen(!isOpen)} />
      <motion.div
        className="flex flex-col h-screen overflow-x-hidden z-20 bg-white"
        animate={{ width: isOpen ? 'calc(100vw - 250px)' : '100vw' }}
        initial={{ width: '100vw' }}
        transition={{ duration: SIDEBAR_HEADER_ANIMATION_DURATION_SECOND }}
        style={{ position: 'absolute', right: 0, top: 0, bottom: 0 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default App;
