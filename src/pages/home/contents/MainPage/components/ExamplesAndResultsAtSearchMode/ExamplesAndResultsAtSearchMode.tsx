import {
  MemoSearchConversation,
  Status,
} from 'pages/home/contents/_interfaces';
import { ResultContent } from './ResultContent';
import { ExampleContents } from './ExampleContents';

interface ExamplesAndResultsAtSearchModeProps {
  status: Status;
  searchAnswer?: MemoSearchConversation;
  navigateToHistory: () => void;
  buttonData: string[];
  handleButtonClick: (message: string) => void;
}

const ExamplesAndResultsAtSearchMode = ({
  status,
  searchAnswer,
  navigateToHistory,
  buttonData,
  handleButtonClick,
}: ExamplesAndResultsAtSearchModeProps) => {
  if (status === 'default') {
    return (
      <ExampleContents
        buttonData={buttonData}
        handleButtonClick={handleButtonClick}
      />
    );
  } else if (status === 'success') {
    return (
      <ResultContent
        searchAnswer={searchAnswer}
        navigateToHistory={navigateToHistory}
      />
    );
  }

  return null;
};

export default ExamplesAndResultsAtSearchMode;
