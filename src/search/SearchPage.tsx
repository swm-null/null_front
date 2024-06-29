import React from 'react';
import { SearchInput } from './component/SearchInput';
import { SearchScrollView } from './component/SearchScrollView';
import { useCachedSearchQueries } from './hook/useCachedSearchQueries';
import { Header } from '../component/Header';

export const SearchPage: React.FC = () => {
  const {
    searchQueries,
    addSearchQuery,
    editSearchQuery,
    removeSearchQuery,
  } = useCachedSearchQueries();

  return (
    <div className='flex flex-col h-screen'>
      <Header text='메모 검색하기'/>
      <SearchScrollView
        removeSearchQuery={removeSearchQuery}
        searchQueries={searchQueries}/>
      <SearchInput addSearchQuery={addSearchQuery} editSearchQuery={editSearchQuery} />
    </div>
  );
};
