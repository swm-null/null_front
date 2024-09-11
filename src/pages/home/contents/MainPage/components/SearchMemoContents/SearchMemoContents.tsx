import { MemoSearchConversation } from 'pages/home/contents/_interfaces';
import { ResultContent } from './ResultContent';
import { ExampleContents } from './ExampleContents';

interface SearchMemoContentProps {
  status: string;
  searchAnswer?: MemoSearchConversation;
  navigateToHistory: () => void;
  buttonData: string[];
  handleButtonClick: (message: string) => void;
}

const SearchMemoContent = ({
  status,
  searchAnswer,
  navigateToHistory,
  buttonData,
  handleButtonClick,
}: SearchMemoContentProps) => {
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

export default SearchMemoContent;
