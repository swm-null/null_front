import { useState } from 'react';
import * as Icon from 'assets/icons';
import { useTranslation } from 'react-i18next';

interface LeftNavBarProps {
  setCurrentPage: (page: string) => void;
}

const LeftNavBar = ({ setCurrentPage }: LeftNavBarProps) => {
  const { t } = useTranslation();

  return (
    <div className="p-4 flex flex-col items-start justify-center gap-[14px]">
      <SidebarTooltipButton
        icon={<Icon.HomeIcon />}
        label={t('pages.sidebar.main')}
        onClick={() => setCurrentPage('')}
      />
      <SidebarTooltipButton
        icon={<Icon.DashboardIcon />}
        label={t('pages.sidebar.dashboard')}
        onClick={() => setCurrentPage('dashboard')}
      />
      <SidebarTooltipButton
        icon={<Icon.HistoryIcon />}
        label={t('pages.sidebar.searchHistory')}
        onClick={() => setCurrentPage('searchHistory')}
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
      className="min-w-12 h-12 px-[14px] bg-peach1 text-[#5D4037] gap-4
        inline-flex items-center shadow-lg rounded-full cursor-pointer"
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
