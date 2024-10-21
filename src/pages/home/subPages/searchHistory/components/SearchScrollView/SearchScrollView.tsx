import { ReactNode, useContext } from 'react';
import { BottomNavContext } from 'utils';

const SearchScrollView = ({ children }: { children: ReactNode }) => {
  const { isSmallScreen, bottomNavHeight } = useContext(BottomNavContext);

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-full">
      <div
        className="flex flex-col overflow-y-scroll no-scrollbar w-full gap-[0.62rem] px-4 pb-4"
        style={{ paddingBottom: isSmallScreen ? bottomNavHeight : 0 }}
      >
        {children}
      </div>
    </div>
  );
};

export default SearchScrollView;
