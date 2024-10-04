import { ReactNode, useCallback, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { MemoSearchConversation } from 'pages/home/subPages/interfaces';

const SearchScrollView = ({
  searchConversations,
  children,
  searchTextArea,
}: {
  searchConversations: MemoSearchConversation[];
  children: ReactNode;
  searchTextArea: ReactNode;
}) => {
  const scrollDirectionRef = useRef<HTMLDivElement>(null);
  const {
    ref: endOfScrollViewObserverRef,
    inView: endOfScrollViewObserverInView,
  } = useInView({
    threshold: 0,
    initialInView: true,
  });

  const scrollToRecent = useCallback(() => {
    if (!endOfScrollViewObserverInView && scrollDirectionRef.current) {
      scrollDirectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [endOfScrollViewObserverInView]);

  useEffect(() => {
    scrollToRecent();
  }, [searchConversations, scrollToRecent]);

  return (
    <div className="relative flex flex-col flex-1 overflow-hidden">
      <div className="flex flex-col overflow-y-scroll no-scrollbar flex-1 w-full">
        <div ref={endOfScrollViewObserverRef} />
        <div ref={scrollDirectionRef} />
        <div className="flex flex-col gap-5 p-4">
          {searchTextArea}
          <div className="flex gap-[0.62rem] flex-col">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default SearchScrollView;
