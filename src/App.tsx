import React, { useState } from 'react';
import './App.css';
import { SearchPage } from './search/SearchPage';
import SideBar from './sidebar/SideBar';
import { SideBarOpenCloseButton } from './sidebar/SideBarOpenCloseButton';
import { AddPage } from './create/AddPage';
import { useSideBarOpenCloseButtonAnimation } from './sidebar/useSideBarOpenCloseButtonAnimation';
import { SIDEBAR_ANIMATION_DURATION, SIDEBAR_BUTTON_ANIMATION_DURATION } from './constants/HeaderSideBarAnimation';

const App = () => {
  const [currentPage, setCurrentPage] = useState<string>('add');
  const [isOpen, setIsOpen] = useState(true);
  const scope = useSideBarOpenCloseButtonAnimation(isOpen);

  const renderContent = () => {
    switch (currentPage) {
      case 'add':
        return <AddPage headerLeftMarginToggle={!isOpen}/>;
      case 'search':
        return <SearchPage headerLeftMarginToggle={!isOpen}/>;
      default:
        return <AddPage headerLeftMarginToggle={!isOpen}/>;
    }
  };

  return (
    <div className="relative flex w-full h-full">
      <SideBar 
        setCurrentPage={setCurrentPage} isSideBarOpen={isOpen}
        sideBarAnimationDuration={SIDEBAR_ANIMATION_DURATION} buttonAnimationDuration={SIDEBAR_BUTTON_ANIMATION_DURATION}
        />
      <div ref={scope} className="flex flex-col w-full h-screen  overflow-x-hidden">
        {renderContent()}
        <SideBarOpenCloseButton handleClick={() => setIsOpen(!isOpen)}/>
      </div>
    </div>
  );
};

export default App;