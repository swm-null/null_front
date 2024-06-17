import React, { useEffect, useRef, useState } from 'react';
import { SearchInput } from './SearchInput.tsx';
import { SearchScrollView } from './SearchScrollView.tsx';
import { v4 as uuid_v4 } from 'uuid';
import { useInView } from 'react-intersection-observer';


interface View {
  id: string;
  text: string;
  left: boolean;
}

const PAGE_SIZE = 10;

export const SearchPage = () => {
  const cachedViews = JSON.parse(localStorage.getItem('views') || '[]');
  const [views, setViews] = useState<View[]>([]);
  const [page, setPage] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<HTMLDivElement | null>(null);

  const loadViews = async () => {
    if (page*PAGE_SIZE > cachedViews.length) return;

    const newCachedViews = cachedViews.slice((page+1)*PAGE_SIZE, (page+2)*PAGE_SIZE-1);
    setViews(prevViews => [...newCachedViews, ...prevViews]);
    setPage(prevPage => prevPage+1);
  };

  const handleIntersection = async (inView) => {
    if (inView && !isLoading) {
      setIsLoading(true);
      await loadViews();
      setIsLoading(false);
    }
  };

  // IntersectionObserver hook을 사용하여 빈 view 감지
  const { ref: emptyViewRef, inView } = useInView({
    root: scrollViewRef.current,
    threshold: 0,
    triggerOnce: false,
    onChange: handleIntersection,
  });

  const addView = (text: string, left: boolean) => {
    const answerID = uuid_v4();
    
    setViews((prevViews) => [
      { id: answerID, text: text, left: left },
      ...prevViews, 
    ]);

    return answerID;
  };

  const editView = (id: string, newText: string) => {
    setViews(prevViews => prevViews.map(view => view.id === id ? { ...view, text: newText } : view));
  };

  const removeView = (id: string) => {
    setViews(prevViews => prevViews.filter(view => view.id !== id));
    return id;
  };

  useEffect(() => {
    const temp = [
      ...views,
      ...cachedViews,
    ];
    localStorage.setItem('views', JSON.stringify(temp.length > 200 ? temp.slice(0, 200) : temp))
  }, [views])

  return (
    <div className='flex flex-col h-screen'>
      <div className='px-4 py-4'>
        <h1>챗봇으로 메모 검색하기</h1>
      </div>
      <SearchScrollView ref={scrollViewRef} removeView={removeView} lastElementRef={emptyViewRef} views={views}/>
      <SearchInput addView={addView} editView={editView}/>
    </div>
  );
};