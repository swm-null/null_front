import * as Interface from 'pages/home/subPages/interfaces';
import { ResultContent } from './ResultContent';
import { ExampleContents } from './ExampleContents';
import { Status } from 'pages/home/subPages/main/interfaces';

interface ExamplesOrResultsAtSearchModeProps {
  status: Status;
  searchAnswer?: Interface.MemoSearchConversation;
  navigateToHistory: () => void;
  buttonData: [string, string, string, string];
  handleButtonClick: (message: string) => void;
}

const ExamplesOrResultsAtSearchMode = ({
  status,
  searchAnswer,
  navigateToHistory,
  buttonData,
  handleButtonClick,
}: ExamplesOrResultsAtSearchModeProps) => {
  return (
    <div className="text-[#111111] overflow-visible">
      {status === 'default' ? (
        <ExampleContents
          buttonData={buttonData}
          handleButtonClick={handleButtonClick}
        />
      ) : (
        <ResultContent
          searchAnswer={searchAnswer}
          navigateToHistory={navigateToHistory}
        />
      )}
    </div>
  );
};

export default ExamplesOrResultsAtSearchMode;
