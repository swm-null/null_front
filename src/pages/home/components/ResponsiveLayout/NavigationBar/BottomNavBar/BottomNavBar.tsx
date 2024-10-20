import * as Icon from 'assets/icons';
import { LegacyRef } from 'react';
import { useTranslation } from 'react-i18next';

interface BottomNavBarProps {
  bottomNavRef: LegacyRef<HTMLDivElement>;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const BottomNavBar = ({
  bottomNavRef,
  currentPage,
  setCurrentPage,
}: BottomNavBarProps) => {
  const { t } = useTranslation();

  return (
    <div ref={bottomNavRef} className="fixed w-full bottom-0">
      <div
        className="flex rounded-full shadow-custom backdrop-blur-lg mb-6 mx-4 px-4 
        bg-[#F5ECE0] border border-black border-opacity-10 bg-clip-padding justify-between items-center"
      >
        <BottomNavButton
          selected={currentPage === ''}
          icon={<Icon.HomeIcon />}
          label={t('pages.sidebar.main')}
          onClick={() => setCurrentPage('')}
        />
        <BottomNavButton
          selected={currentPage === 'dashboard'}
          icon={<Icon.DashboardIcon />}
          label={t('pages.sidebar.dashboard')}
          onClick={() => setCurrentPage('dashboard')}
        />
        <BottomNavButton
          selected={currentPage === 'searchHistory'}
          icon={<Icon.HistoryIcon />}
          label={t('pages.sidebar.searchHistory')}
          onClick={() => setCurrentPage('searchHistory')}
        />
        <BottomNavButton
          selected={currentPage === 'uploadData'}
          icon={<Icon.ExportIcon />}
          label={t('pages.sidebar.uploadData')}
          onClick={() => setCurrentPage('uploadData')}
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
      className="py-2 flex gap-2 flex-1 flex-col items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`px-3 h-7 content-center rounded-xl ${selected ? 'bg-peach2-transparent' : ''} `}
      >
        {icon}
      </div>
      <span className="text-xs text-[#5D4037] text-center">{label}</span>
    </div>
  );
};

export default BottomNavBar;
