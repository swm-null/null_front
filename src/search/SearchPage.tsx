import React from 'react';
import { SearchInput } from './component/SearchInput';
import { SearchScrollView } from './component/SearchScrollView';
import { useCachedSearchQueries } from './hook/useCachedSearchQueries';
import { AnimatedHeader } from '../component/AnimatedHeader';

export const SearchPage = ({headerLeftMarginToggle, headerLeftMargin, headerAnimationDuration, headerToggleOnDuration, headerToggleOffDuration}: {
  headerLeftMarginToggle?: boolean
  headerLeftMargin?: number
  headerAnimationDuration?: number
  headerToggleOnDuration?: number
  headerToggleOffDuration?: number
}) => {
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
        leftMargin={headerLeftMargin}
        animationDuration={headerAnimationDuration} 
        toggleOnDurationDelay={headerToggleOnDuration}
        toggleOffDurationDelay={headerToggleOffDuration}/>
      <SearchScrollView
        removeSearchConversation={removeSearchConversation}
        searchConversations={searchConversations}/>
      <SearchInput addSearchConversation={addSearchConversation} editSearchConversation={editSearchConversation} />
    </div>
  );
};
