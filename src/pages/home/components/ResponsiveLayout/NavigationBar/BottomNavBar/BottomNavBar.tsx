import * as Icon from 'assets/icons';
import { useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BottomNavContext,
  CreateResetContext,
  DashboardResetContext,
  SearchResetContext,
} from 'utils';

interface BottomNavBarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const BottomNavBar = ({ currentPage, setCurrentPage }: BottomNavBarProps) => {
  const { t } = useTranslation();
  const { setBottomNavHeight } = useContext(BottomNavContext);
  const { onReset: onCreateReset } = useContext(CreateResetContext);
  const { onReset: onSearchReset } = useContext(SearchResetContext);
  const { onReset: onDashboardReset } = useContext(DashboardResetContext);

  const bottomNavRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomNavRef.current) {
      setBottomNavHeight(bottomNavRef.current.offsetHeight);
    }
  }, [bottomNavRef]);

  const handleClickCreate = () => {
    onCreateReset();
    setCurrentPage('');
  };

  const handleClickSearch = () => {
    onSearchReset();
    setCurrentPage('search');
  };

  const handleClickDashboard = () => {
    onDashboardReset();
    setCurrentPage('dashboard');
  };

  return (
    <div ref={bottomNavRef} className="fixed w-full bottom-0">
      <div
        className="flex rounded-full shadow-custom backdrop-blur-lg mb-6 mx-4 px-4 
        bg-[#F5ECE0] border border-black border-opacity-10 bg-clip-padding justify-between items-center"
      >
        <BottomNavButton
          selected={currentPage === ''}
          icon={<Icon.AddIcon />}
          label={t('pages.sidebar.create')}
          onClick={handleClickCreate}
        />
        <BottomNavButton
          selected={currentPage === 'search'}
          icon={<Icon.SearchIcon />}
          label={t('pages.sidebar.search')}
          onClick={handleClickSearch}
        />
        <BottomNavButton
          selected={currentPage === 'dashboard'}
          icon={<Icon.DashboardIcon />}
          label={t('pages.sidebar.dashboard')}
          onClick={handleClickDashboard}
        />
      </div>
    </div>
  );
};

const BottomNavButton = ({
  selected,
  icon,
  label,
  onClick,
}: {
  selected: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="py-3 h-[4.25rem] flex gap-1 flex-1 flex-col items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`h-7 flex flex-shrink-0 items-center ${selected ? 'text-brown1' : 'text-gray3'} `}
      >
        {icon}
      </div>
      <span
        className={`text-xs ${selected ? 'text-[#5D4037]' : 'text-gray3'}  text-center`}
      >
        {label}
      </span>
    </div>
  );
};

export default BottomNavBar;
