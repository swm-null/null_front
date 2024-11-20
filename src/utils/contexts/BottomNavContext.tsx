import { createContext, ReactNode, useState } from 'react';

interface BottomNavContextType {
  bottomNavHeight: number;
  setBottomNavHeight: (height: number) => void;
  isSmallScreen: boolean;
  setIsSmallScreen: (isSmallScreen: boolean) => void;
}

export const BottomNavContext = createContext<BottomNavContextType>({
  bottomNavHeight: 0,
  setBottomNavHeight: (_: number) => {},
  isSmallScreen: false,
  setIsSmallScreen: (_: boolean) => {},
});

export const BottomNavProvider = ({ children }: { children: ReactNode }) => {
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
