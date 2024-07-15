import { AddIcon, SearchIcon } from 'assets/icons';

interface SideBarProps {
  setCurrentPage: (page: string) => void;
  sideBarWidth?: number;
  zIndex: number;
}

const SideBar = ({
  setCurrentPage,
  sideBarWidth = 250,
  zIndex,
}: SideBarProps) => {
  return (
    <div className={`z-${zIndex} h-screen bg-gray-100 flex flex-col`}>
      {/* TODO: tailwind에서 동적 데이터 지원하는지 확인 */}
      <div
        className={`p-4 flex flex-col flex-1`}
        style={{ width: sideBarWidth }}
      >
        <div className="items-center my-6">
          <div className="flex justify-center">
            <button
              className="my-4 flex py-2 px-6 text-white bg-gray-500 rounded-full"
              onClick={() => setCurrentPage('add')}
            >
              <AddIcon className="w-4 h-4 self-center mr-2" />
              Add Memo
            </button>
          </div>
          <button
            className="flex items-center p-2 w-full text-left rounded"
            onClick={() => setCurrentPage('search')}
          >
            <SearchIcon className="w-5 h-5 self-center mr-2" />
            Search
          </button>
        </div>
        <div className="flex flex-col flex-1" />
      </div>
    </div>
  );
};

export default SideBar;
