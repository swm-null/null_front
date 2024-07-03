import React, { useEffect } from 'react';
import { ReactComponent as SearchLogo } from '../assets/icons/search.svg';
import { ReactComponent as AddLogo } from '../assets/icons/add.svg';
import { motion, useAnimation } from 'framer-motion';

interface SideBarProps {
  setCurrentPage: (page: string) => void;
  isSideBarOpen: boolean;
  sideBarWidth: number;
  buttonAnimationDuration: number;
  sideBarAnimationDuration: number;
}

const SideBar = ({ setCurrentPage, isSideBarOpen, sideBarWidth, buttonAnimationDuration, sideBarAnimationDuration }: SideBarProps) => {
  const buttonControls = useAnimation();
  const sidebarControls = useAnimation();

  useEffect(() => {
    if (isSideBarOpen) {
      sidebarControls.start({ width: sideBarWidth, transition: { duration: sideBarAnimationDuration / 1000 } });
      setTimeout(() => {
        buttonControls.start({ opacity: 1, x: 0, transition: { duration: buttonAnimationDuration / 1000 } });
      }, sideBarAnimationDuration); 
    } else {
      buttonControls.start({ opacity: 0, x: -50, transition: { duration: buttonAnimationDuration / 1000 } });
      setTimeout(() => {
        sidebarControls.start({ width: 0, transition: { duration: sideBarAnimationDuration / 1000 } });
      }, buttonAnimationDuration); 
    }
  }, [isSideBarOpen, sidebarControls, buttonControls, sideBarWidth, sideBarAnimationDuration, buttonAnimationDuration]);

  return (
    <motion.div 
      className='h-screen bg-gray-100 flex flex-col'
      animate={sidebarControls}>
      <div className={`p-4 flex flex-col flex-1`} style={{width: sideBarWidth}}>
        <div className="items-center my-6">
          <div className='flex justify-center'>
            <motion.button 
              className="my-4 flex py-2 px-6 text-white bg-gray-500 rounded-full"
              onClick={() => setCurrentPage('add')}
              animate={buttonControls}
              style={{ opacity: 0, x: -50 }}>
              <AddLogo className='w-4 h-4 self-center mr-2'/>
              Add Memo
            </motion.button>
          </div>
          <motion.button 
            className="flex items-center p-2 w-full text-left rounded"
            onClick={() => setCurrentPage('search')}
            animate={buttonControls}
            style={{ opacity: 0, x: -50 }}>
            <SearchLogo className='w-5 h-5 self-center mr-2'/>
            Search
          </motion.button>
        </div>
        <div className='flex flex-col flex-1'/>
      </div>
    </motion.div>
  );
};

export default SideBar;