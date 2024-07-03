import React from 'react';
import { SearchInput } from './component/SearchInput';
import { SearchScrollView } from './component/SearchScrollView';
import { useCachedSearchQueries } from './hook/useCachedSearchQueries';
import { AnimatedHeader } from '../component/AnimatedHeader';
import { HEADER_ANIMATION_DELAY, HEADER_ANIMATION_DURATION } from '../constants/HeaderSideBarAnimation';

export const SearchPage = ({ headerLeftMarginToggle }: { headerLeftMarginToggle?: boolean}) => {
  const {
    searchConversations,
    addSearchConversation,
    editSearchConversation,
    removeSearchConversation,
  } = useCachedSearchQueries();

  return (
    <div className='flex flex-col flex-1 h-screen'>
      <AnimatedHeader 
        text={'메모 검색하기'} 
        leftMarginToggle={headerLeftMarginToggle}
        animationDuration={HEADER_ANIMATION_DURATION} 
        toggleOnDurationDelay={HEADER_ANIMATION_DELAY}/>
      <SearchScrollView
        removeSearchConversation={removeSearchConversation}
        searchConversations={searchConversations}/>
      <SearchInput addSearchConversation={addSearchConversation} editSearchConversation={editSearchConversation} />
    </div>
  );
};
