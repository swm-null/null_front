import * as Interface from 'pages/home/subPages/interfaces';
import { ResultContent } from './ResultContent';
import { ExampleContents } from './ExampleContents';
import { useContext } from 'react';
import { BottomNavContext } from 'utils';
import { Status } from 'pages/home/subPages/types';

interface ExamplesOrResultsProps {
  status: Status;
  searchConversation?: Interface.MemoSearchConversation;
  navigateToHistory: () => void;
  buttonData: [string, string, string, string];
  handleButtonClick: (message: string) => void;
}

const ExamplesOrResults = ({
  status,
  searchConversation,
  navigateToHistory,
  buttonData,
  handleButtonClick,
}: ExamplesOrResultsProps) => {
  const { isSmallScreen, bottomNavHeight } = useContext(BottomNavContext);

  return (
    <div
      className="flex flex-col flex-grow-0 text-[#111111] overflow-hidden p-4 pt-0"
      style={{ paddingBottom: isSmallScreen ? bottomNavHeight + 24 : 0 }}
    >
      {status === 'default' ? (
        <ExampleContents
          buttonData={buttonData}
          handleButtonClick={handleButtonClick}
        />
      ) : (
        <ResultContent
          searchConversation={searchConversation}
          navigateToHistory={navigateToHistory}
        />
      )}
    </div>
  );
};

export default ExamplesOrResults;
