import { useTranslation } from 'react-i18next';
import { Header } from 'pages/home/subPages/components';
import { MemoSearchConversation } from 'pages/home/subPages/interfaces';
import { SearchScrollView } from './components';
import { SearchHistoryAccordion } from './components/SearchHistoryAccordion';
import { MemoSearchTextArea } from '../components/memo/MemoSearchTextArea';
import { ChangeEvent, useState } from 'react';

const SearchHistoryPage = ({}: {}) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const searchConversations: MemoSearchConversation[] = JSON.parse(
    localStorage.getItem('search_queries') || '[]'
  );
  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  const handleSubmit = (message: string) => {
    console.log(message);
  };

  return (
    <div className="flex flex-col flex-1 h-screen bg-custom-gradient-basic">
      <div className="max-w-[740px] pt-24 pb-16 w-full flex flex-col flex-1 text-gray2 overflow-hidden self-center">
        <Header headerText={t('pages.searchHistory.header')} />
        <SearchScrollView searchConversations={searchConversations}>
          <>
            <MemoSearchTextArea
              value={message}
              onChange={handleMessageChange}
              placeholder={t('pages.searchHistory.inputPlaceholder')}
              onSubmit={() => handleSubmit(message)}
            />
            {searchConversations.map((searchConversation) => (
              <SearchHistoryAccordion
                key={searchConversation.id}
                data={searchConversation}
              />
            ))}
          </>
        </SearchScrollView>
      </div>
    </div>
  );
};

export default SearchHistoryPage;
