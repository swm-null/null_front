import { useContext, useState } from 'react';
import * as Icon from 'assets/icons';
import { useTranslation } from 'react-i18next';
import {
  CreateResetContext,
  DashboardResetContext,
  SearchResetContext,
} from 'utils';

interface LeftNavBarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const LeftNavBar = ({ currentPage, setCurrentPage }: LeftNavBarProps) => {
  const { t } = useTranslation();
  const { onReset: onCreateReset } = useContext(CreateResetContext);
  const { onReset: onSearchReset, onInvalid: onSearchInvalid } =
    useContext(SearchResetContext);
  const { onReset: onDashboardReset, onInvalid: onDashboardInvalid } =
    useContext(DashboardResetContext);

  const handleClickCreate = () => {
    onCreateReset();
    setCurrentPage('');
  };

  const handleClickSearch = () => {
    onSearchReset();
    onSearchInvalid();
    setCurrentPage('search');
  };

  const handleClickDashboard = () => {
    onDashboardReset();
    onDashboardInvalid();
    setCurrentPage('dashboard');
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex overflow-x-hidden z-20 items-center justify-center self-center">
        <div className="p-4 flex flex-col items-start justify-center gap-[14px]">
          <SidebarTooltipButton
            selected={currentPage === ''}
            icon={<Icon.AddIcon />}
            label={t('pages.sidebar.create')}
            onClick={handleClickCreate}
          />
          <SidebarTooltipButton
            selected={currentPage === 'search'}
            icon={<Icon.SearchIcon />}
            label={t('pages.sidebar.search')}
            onClick={handleClickSearch}
          />
          <SidebarTooltipButton
            selected={currentPage === 'dashboard'}
            icon={<Icon.DashboardIcon />}
            label={t('pages.sidebar.dashboard')}
            onClick={handleClickDashboard}
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
      className={`min-w-12 h-12 px-[14px] ${selected ? 'bg-peach0 bg-opacity-80' : 'bg-peach1 text-opacity-80 bg-opacity-50'} text-[#5D4037] gap-4
        inline-flex items-center shadow-custom backdrop-blur-lg rounded-full cursor-pointer`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div className="flex w-5 items-center justify-center">{icon}</div>
      {hovered && <span className="whitespace-nowrap">{label}</span>}
    </div>
  );
};

export default LeftNavBar;
