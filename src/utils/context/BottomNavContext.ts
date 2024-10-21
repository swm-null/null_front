import { createContext } from 'react';

interface BottomNavContextType {
  bottomNavHeight: number;
  setBottomNavHeight: (height: number) => void;
  isSmallScreen: boolean;
  setIsSmallScreen: (isSmallScreen: boolean) => void;
}

const BottomNavContext = createContext<BottomNavContextType>({
  bottomNavHeight: 0,
  setBottomNavHeight: (_: number) => {},
  isSmallScreen: false,
  setIsSmallScreen: (_: boolean) => {},
});

export default BottomNavContext;
