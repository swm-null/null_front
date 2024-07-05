import React from 'react';
import { useSearchConversationManager } from './hook/useSearchConversationManager';
import { HEADER_ANIMATION_DELAY, HEADER_ANIMATION_DURATION } from 'constants/HeaderSideBarAnimation';
import { AnimatedHeader } from 'components/ui';
import { SearchInput, SearchScrollView } from './components';

export const SearchPage = ({ headerLeftMarginToggle }: { headerLeftMarginToggle?: boolean}) => {
  const {
    searchConversations,
    addSearchConversation,
    editSearchConversation,
    removeSearchConversation,
  } = useSearchConversationManager();

  return (
    <div className='flex flex-col flex-1 h-screen text-gray2'>
      <AnimatedHeader 
        text={'메모 검색하기'} 
        leftMarginToggle={headerLeftMarginToggle}
        animationDuration={HEADER_ANIMATION_DURATION} 
        toggleOnDurationDelay={HEADER_ANIMATION_DELAY}/>
      <SearchScrollView
        removeSearchConversation={removeSearchConversation}
        searchConversations={searchConversations}/>
      <SearchInput
        addSearchConversation={addSearchConversation} 
        editSearchConversation={editSearchConversation} />
    </div>
  );
};
