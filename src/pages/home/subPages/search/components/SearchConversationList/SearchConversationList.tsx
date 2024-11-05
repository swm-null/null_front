import { ReactNode, useContext, useRef } from 'react';
import { BottomNavContext } from 'utils';
import { useIntersectionObserver } from 'pages/home/subPages/hooks';

interface SearchConversationListProps {
  fetchNextPage: () => void;
  children: ReactNode;
}

const SearchConversationList = ({
  fetchNextPage,
  children,
}: SearchConversationListProps) => {
  const { isSmallScreen, bottomNavHeight } = useContext(BottomNavContext);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useIntersectionObserver(observerRef, {
    callback: (entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    },
    options: { threshold: 0.5 },
  });

  return (
    <div
      className="flex flex-col p-4 pt-0"
      style={{ paddingBottom: isSmallScreen ? bottomNavHeight + 24 : 0 }}
    >
      <div className="flex flex-col gap-3">{children}</div>
      <div ref={observerRef} className="min-h-[1px] bg-transparent" />
    </div>
  );
};

export default SearchConversationList;
