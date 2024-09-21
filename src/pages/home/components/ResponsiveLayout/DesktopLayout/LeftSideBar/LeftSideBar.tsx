import { useState } from 'react';
import * as Icon from 'assets/icons';
import { useTranslation } from 'react-i18next';

interface LeftSideBarProps {
  setCurrentPage: (page: string) => void;
}

const LeftSideBar = ({ setCurrentPage }: LeftSideBarProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={`p-4 h-full flex flex-col flex-1 items-start justify-center gap-[14px]`}
    >
      <SidebarTooltipButton
        icon={<Icon.HomeIcon />}
        label={t('pages.sidebar.main')}
        onClick={() => setCurrentPage('main')}
      />
      <SidebarTooltipButton
        icon={<Icon.HistoryIcon />}
        label={t('pages.sidebar.dashboard')}
        onClick={() => setCurrentPage('searchHistory')}
      />
      <SidebarTooltipButton
        icon={<Icon.DashboardIcon />}
        label={t('pages.sidebar.searchHistory')}
        onClick={() => setCurrentPage('dashboard')}
      />
      <SidebarTooltipButton
        icon={<Icon.ExportIcon />}
        label={t('pages.sidebar.uploadData')}
        onClick={() => setCurrentPage('uploadData')}
      />
    </div>
  );
};

const SidebarTooltipButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`transition-all duration-300 ease-in-out inline-flex items-center bg-[#F5ECE0] text-[#5D4037] shadow-lg rounded-full cursor-pointer min-w-[48px] h-[48px] px-4`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div className="flex items-center justify-center h-[56px]">{icon}</div>
      {hovered && <span className="ml-4 whitespace-nowrap">{label}</span>}
    </div>
  );
};

export default LeftSideBar;
