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

  useEffect(() => {
    if (isSmallScreen) {
      setIsOpen(false);
    }
  }, [isSmallScreen]);

  // 화면이 작은 경우
  if (isSmallScreen) {
    return (
      <div ref={scope} className="flex w-full h-full">
        <SideBarOpenCloseButton handleClick={() => setIsOpen(!isOpen)} />
        <motion.div
          className="overflow-x-hidden z-20"
          animate={{ width: isOpen ? '250px' : '0' }}
          initial={{ width: isOpen ? '250px' : '0' }}
          transition={{ duration: SIDEBAR_HEADER_ANIMATION_DURATION_SECOND }}
          style={{ position: 'absolute', left: 0, top: 0, bottom: 0 }}
        >
          <SideBar zIndex={20} setCurrentPage={setCurrentPage} />
        </motion.div>
        <div
          className="flex flex-col h-screen overflow-x-hidden z-10"
          style={{ position: 'absolute', right: 0, top: 0, bottom: 0, left: 0 }}
        >
          {renderContent(false)}
          {/* 불투명한 배경을 클릭했을 때 메뉴바 닫기 */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{
              duration: SIDEBAR_HEADER_ANIMATION_DURATION_SECOND,
            }}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          />
        </div>
      </div>
    );
  }

  // 화면이 큰 경우, 사이드바를 맨 뒤에 놓고, 페이지 화면의 width를 조절
  return (
    <div ref={scope} className="flex w-full h-full">
      <SideBarOpenCloseButton handleClick={() => setIsOpen(!isOpen)} />
      <SideBar zIndex={10} setCurrentPage={setCurrentPage} />
      <motion.div
        className="flex flex-col h-screen overflow-x-hidden z-20 bg-white"
        animate={{ width: isOpen ? 'calc(100vw - 250px)' : '100vw' }}
        initial={{ width: isOpen ? 'calc(100vw - 250px)' : '100vw' }}
        transition={{ duration: SIDEBAR_HEADER_ANIMATION_DURATION_SECOND }}
        style={{ position: 'absolute', right: 0, top: 0, bottom: 0 }}
      >
        {renderContent(true)}
      </motion.div>
    </div>
  );
};

export default App;
