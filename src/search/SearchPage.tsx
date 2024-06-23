import React from 'react';
import { SearchInput } from './component/SearchInput.tsx';
import { SearchScrollView } from './component/SearchScrollView.tsx';
import { useCachedSearchQueries } from './hook/useCachedSearchQueries.tsx';

export const SearchPage: React.FC = () => {
  const {
    searchQueries,
    addSearchQuery,
    editSearchQuery,
    removeSearchQuery,
    emptyViewRef
  } = useCachedSearchQueries();

  return (
    <div className='flex flex-col h-screen'>
      <div className='px-4 py-4'>
        <p className='font-semibold text-lg'>챗봇으로 메모 검색하기</p>
      </div>
      <SearchScrollView
        removeSearchQuery={removeSearchQuery}
        lastElementRef={emptyViewRef}
        searchQueries={searchQueries}
      />
      <SearchInput addSearchQuery={addSearchQuery} editSearchQuery={editSearchQuery} />
    </div>
  );
};
