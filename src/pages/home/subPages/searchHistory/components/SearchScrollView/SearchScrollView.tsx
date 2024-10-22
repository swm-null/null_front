import { useIntersectionObserver } from 'pages/home/subPages/hooks';
import { ReactNode, useContext, useRef } from 'react';
import { BottomNavContext } from 'utils';

const SearchScrollView = ({
  children,
  fetchNextPage,
}: {
  children: ReactNode;
  fetchNextPage: () => void;
}) => {
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
    <div className="flex flex-col flex-1 overflow-hidden h-full">
      <div
        className="flex flex-col overflow-y-scroll no-scrollbar w-full px-4 pb-4"
        style={{ paddingBottom: isSmallScreen ? bottomNavHeight + 24 : 0 }}
      >
        <div className="flex flex-col gap-[0.62rem]">{children}</div>
        <div ref={observerRef} />
      </div>
    </div>
  );
};

export default SearchScrollView;
