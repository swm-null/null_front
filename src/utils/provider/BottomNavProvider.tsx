import { ReactNode, useState } from 'react';
import { BottomNavContext } from 'utils';

const BottomNavProvider = ({ children }: { children: ReactNode }) => {
  const [bottomNavHeight, setBottomNavHeight] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  return (
    <BottomNavContext.Provider
      value={{
        bottomNavHeight,
        setBottomNavHeight,
        isSmallScreen,
        setIsSmallScreen,
      }}
    >
      {children}
    </BottomNavContext.Provider>
  );
};

export default BottomNavProvider;
