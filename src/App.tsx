import React, { useState } from 'react';
import './App.css';
import { SearchPage } from './search/SearchPage';
import SideBar from './sidebar/SideBar';
import { SideBarOpenCloseButton } from './sidebar/SideBarOpenCloseButton';
import { AddPage } from './create/AddPage';
import { useSideBarOpenCloseButtonAnimation } from './sidebar/useSideBarOpenCloseButtonAnimation';

const SIDEBAR_WIDTH = 250;
const HEADER_LEFT_MARGIN = 48;
const SIDEBAR_ANIMATION_DURATION = 300;
const HEADER_ANIMATION_DURATION = SIDEBAR_ANIMATION_DURATION / 1000;
const SIDEBAR_BUTTON_ANIMATION_DURATION = 200;
const HEADER_ANIMATION_DELAY = SIDEBAR_BUTTON_ANIMATION_DURATION / 1000;


const App = () => {
  const [currentPage, setCurrentPage] = useState<string>('add');
  const [isOpen, setIsOpen] = useState(true);
  const scope = useSideBarOpenCloseButtonAnimation(isOpen);
  const commonProps = {
    headerLeftMarginToggle: !isOpen,
    headerLeftMargin: HEADER_LEFT_MARGIN,
    headerAnimationDuration: HEADER_ANIMATION_DURATION,
    headerToggleOnDuration: HEADER_ANIMATION_DELAY,
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'add':
        return <AddPage {...commonProps}/>;
      case 'search':
        return <SearchPage {...commonProps}/>;
      default:
        return <AddPage {...commonProps}/>;
    }
  };

  return (
    <div className="relative flex w-full h-full">
      <SideBar 
        setCurrentPage={setCurrentPage} isSideBarOpen={isOpen} sideBarWidth={SIDEBAR_WIDTH}
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