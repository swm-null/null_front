import { useState } from 'react';
import * as Icon from 'assets/icons';
import { useTranslation } from 'react-i18next';

interface LeftNavBarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const LeftNavBar = ({ currentPage, setCurrentPage }: LeftNavBarProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full h-full">
      <div className="flex overflow-x-hidden z-20 items-center justify-center self-center">
        <div className="p-4 flex flex-col items-start justify-center gap-[14px]">
          <SidebarTooltipButton
            selected={currentPage === ''}
            icon={<Icon.HomeIcon />}
            label={t('pages.sidebar.main')}
            onClick={() => setCurrentPage('')}
          />
          <SidebarTooltipButton
            selected={currentPage === 'dashboard'}
            icon={<Icon.DashboardIcon />}
            label={t('pages.sidebar.dashboard')}
            onClick={() => setCurrentPage('dashboard')}
          />
          <SidebarTooltipButton
            selected={currentPage === 'searchHistory'}
            icon={<Icon.HistoryIcon />}
            label={t('pages.sidebar.searchHistory')}
            onClick={() => setCurrentPage('searchHistory')}
          />
          <SidebarTooltipButton
            selected={currentPage === 'uploadData'}
            icon={<Icon.ExportIcon />}
            label={t('pages.sidebar.uploadData')}
            onClick={() => setCurrentPage('uploadData')}
          />
        </div>
      </div>
    </div>
  );
};

const SidebarTooltipButton = ({
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
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`min-w-12 h-12 px-[14px] ${selected ? 'bg-yellow0' : 'bg-peach1'} text-[#5D4037] gap-4
        inline-flex items-center shadow-custom backdrop-blur-lg rounded-full cursor-pointer`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div className="flex items-center justify-center">{icon}</div>
      {hovered && <span className="whitespace-nowrap">{label}</span>}
    </div>
  );
};

export default LeftNavBar;
