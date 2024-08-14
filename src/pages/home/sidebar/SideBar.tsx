import { DashboardIcon, SearchIcon, UploadDataIcon } from 'assets/icons';
import { SideBarButton } from './components';

interface SideBarProps {
  setCurrentPage: (page: string) => void;
  sideBarWidth?: number;
}

const SideBar = ({ setCurrentPage, sideBarWidth = 250 }: SideBarProps) => {
  return (
    <div className={`h-screen bg-gray-100 flex flex-col`}>
      {/* TODO: tailwind에서 동적 데이터 지원하는지 확인 */}
      <div
        className={`p-4 flex flex-col flex-1`}
        style={{ width: sideBarWidth }}
      >
        <div className="items-center my-6">
          <div className="flex justify-center">
            <button
              className="my-4 flex py-2 px-6 text-white bg-gray-500 rounded-full"
              onClick={() => setCurrentPage('main')}
            >
              Oat Note
            </button>
          </div>
          <SideBarButton
            icon={<SearchIcon className="w-5 h-5 self-center mr-2" />}
            label="Search History"
            onClick={() => setCurrentPage('searchHistory')}
          />
          <SideBarButton
            icon={
              <DashboardIcon className="w-4 h-4 ml-[2px] self-center mr-[10px]" />
            }
            label="Dashboard"
            onClick={() => setCurrentPage('dashboard')}
          />
          <SideBarButton
            icon={
              <UploadDataIcon className="w-4 h-4 ml-[2px] self-center mr-[10px]" />
            }
            label="Upload Data"
            onClick={() => setCurrentPage('uploadData')}
          />
        </div>
        <div className="flex flex-col flex-1" />
      </div>
    </div>
  );
};

export default SideBar;
