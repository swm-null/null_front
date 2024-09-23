import * as Interface from 'pages/home/contents/_interfaces';
import { ResultContent } from './ResultContent';
import { ExampleContents } from './ExampleContents';

interface ExamplesOrResultsAtSearchModeProps {
  status: Interface.Status;
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
    <div className="text-[#111111]">
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
