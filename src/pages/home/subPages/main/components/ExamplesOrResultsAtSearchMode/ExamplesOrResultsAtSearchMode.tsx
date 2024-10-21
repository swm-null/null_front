import * as Interface from 'pages/home/subPages/interfaces';
import { ResultContent } from './ResultContent';
import { ExampleContents } from './ExampleContents';
import { Status } from 'pages/home/subPages/main/interfaces';

interface ExamplesOrResultsAtSearchModeProps {
  status: Status;
  searchConversation?: Interface.MemoSearchConversation;
  navigateToHistory: () => void;
  buttonData: [string, string, string, string];
  handleButtonClick: (message: string) => void;
}

const ExamplesOrResultsAtSearchMode = ({
  status,
  searchConversation,
  navigateToHistory,
  buttonData,
  handleButtonClick,
}: ExamplesOrResultsAtSearchModeProps) => {
  return (
    <div className="flex flex-col flex-grow-0 text-[#111111] overflow-hidden p-4 pt-0">
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

export default ExamplesOrResultsAtSearchMode;
