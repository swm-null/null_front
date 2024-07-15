import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SideBar from './sidebar/SideBar';
import { SideBarOpenCloseButton } from './sidebar/SideBarOpenCloseButton';
import { useSideBarOpenCloseButtonAnimation } from './sidebar/useSideBarOpenCloseButtonAnimation';
import { AddPage, SearchPage } from './pages';
import { SIDEBAR_HEADER_ANIMATION_DURATION_SECOND } from 'constants/HeaderSideBarAnimation';

const App = () => {
  const [currentPage, setCurrentPage] = useState<string>('add');
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.innerWidth <= 770
  );
  const [isOpen, setIsOpen] = useState(true);
  const scope = useSideBarOpenCloseButtonAnimation(isOpen);

  const renderContent = (useIsOpen: boolean) => {
    switch (currentPage) {
      case 'add':
        return <AddPage headerLeftMarginToggle={useIsOpen ? !isOpen : true} />;
      case 'search':
        return (
          <SearchPage headerLeftMarginToggle={useIsOpen ? !isOpen : true} />
        );
      default:
        return <AddPage headerLeftMarginToggle={useIsOpen ? !isOpen : true} />;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 770);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 화면이 작은 경우
  if (isSmallScreen) {
    return (
      <div ref={scope} className="flex w-full h-full">
        <SideBarOpenCloseButton handleClick={() => setIsOpen(!isOpen)} />
        <motion.div
          className="overflow-x-hidden z-20"
          animate={{ width: isOpen ? '250px' : '0' }}
          initial={{ width: '250px' }}
          transition={{ duration: SIDEBAR_HEADER_ANIMATION_DURATION_SECOND }}
          style={{ position: 'absolute', left: 0, top: 0, bottom: 0 }}
        >
          <SideBar zIndex={20} setCurrentPage={setCurrentPage} />
        </motion.div>
        <div
          className="flex flex-col h-screen overflow-x-hidden z-10 bg-white"
          style={{ position: 'absolute', right: 0, top: 0, bottom: 0, left: 0 }}
        >
          {renderContent(false)}
        </div>
      </div>
    );
  }

  // 화면이 큰 경우, 사이드바를 맨 뒤에 놓고, 페이지 화면의 width를 조절
  return (
    <div ref={scope} className="flex w-full h-full">
      <SideBarOpenCloseButton handleClick={() => setIsOpen(!isOpen)} />
      <motion.div
        className="flex flex-col h-screen overflow-x-hidden z-20 bg-white"
        animate={{ width: isOpen ? 'calc(100vw - 250px)' : '100vw' }}
        initial={{ width: '100vw' }}
        transition={{ duration: SIDEBAR_HEADER_ANIMATION_DURATION_SECOND }}
        style={{ position: 'absolute', right: 0, top: 0, bottom: 0 }}
      >
        {renderContent(true)}
      </motion.div>
      <SideBar zIndex={10} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default App;
