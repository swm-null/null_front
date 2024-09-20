import * as Icon from 'assets/icons';

interface BottomNavBarProps {
  setCurrentPage: (page: string) => void;
}

const BottomNavBar = ({ setCurrentPage }: BottomNavBarProps) => {
  return (
    <div className="fixed w-full bottom-0">
      <div className="flex rounded-full shadow-lg mb-6 mx-4 px-4 bg-[#F5ECE0] border-[1px] border-[#E2BCA6] justify-between items-center">
        <BottomNavButton
          icon={<Icon.HomeIcon />}
          label="메인"
          onClick={() => setCurrentPage('main')}
        />
        <BottomNavButton
          icon={<Icon.DashboardIcon />}
          label="대시보드"
          onClick={() => setCurrentPage('dashboard')}
        />
        <BottomNavButton
          icon={<Icon.HistoryIcon />}
          label="기록"
          onClick={() => setCurrentPage('searchHistory')}
        />
        <BottomNavButton
          icon={<Icon.ExportIcon />}
          label="불러오기"
          onClick={() => setCurrentPage('uploadData')}
        />
      </div>
    </div>
  );
};

const BottomNavButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="py-3 flex flex-1 flex-col items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <div className="mb-2">{icon}</div>
      <span className="text-xs text-[#5D4037] text-center">{label}</span>
    </div>
  );
};

export default BottomNavBar;
