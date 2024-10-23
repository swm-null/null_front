import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MemoSearchTextArea } from '../components';
import { useSearchMemoManager } from './hook';
import { ExamplesOrResults } from './ExamplesOrResults';

const SearchPage = ({ navigateToHistory }: { navigateToHistory: () => void }) => {
  const { t } = useTranslation();

  const [message, setMessage] = useState('');

  const searchMemoManager = useSearchMemoManager();

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (message: string) => {
    searchMemoManager.trySearchMemoAndSetStatus(message, setMessage);
  };

  const buttonData: [string, string, string, string] = [
    '라면 레시피 메모 보여줘',
    '민지 전화번호 알려줘',
    '맛집 내가 저번에 적은 거 뭐더라',
    '나 신발 사야하는데 사이즈 알려줘',
  ];

  return (
    <div className="flex justify-center overflow-hidden h-full">
      <div className="max-w-[740px] h-full flex flex-col flex-1 text-gray3">
        <MemoSearchTextArea
          value={message}
          onChange={handleMessageChange}
          placeholder={t('pages.search.inputPlaceholder')}
          onSubmit={() => handleSubmit(message)}
        />
        <ExamplesOrResults
          status={searchMemoManager.status}
          searchConversation={searchMemoManager.searchConversation}
          navigateToHistory={navigateToHistory}
          buttonData={buttonData}
          handleButtonClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default SearchPage;
