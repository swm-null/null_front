import { useTranslation } from 'react-i18next';
import { Header } from 'pages/home/subPages/components';
import { MemoSearchConversation } from 'pages/home/subPages/interfaces';
import { SearchScrollView } from './components';
import { SearchHistoryAccordion } from './components/SearchHistoryAccordion';

const SearchHistoryPage = ({}: {}) => {
  const { t } = useTranslation();
  const searchConversations: MemoSearchConversation[] = JSON.parse(
    localStorage.getItem('search_queries') || '[]'
  );

  return (
    <div className="flex flex-col flex-1 h-screen bg-custom-gradient-basic text-gray2 px-4 pb-4">
      <Header headerText={t('pages.search.header')} />
      <div className="max-w-[740px] w-full flex flex-col flex-1 text-gray2 overflow-hidden self-center">
        <SearchScrollView searchConversations={searchConversations}>
          {searchConversations.map((searchConversation) => (
            <SearchHistoryAccordion
              key={searchConversation.id}
              data={searchConversation}
            />
          ))}
        </SearchScrollView>
      </div>
    </div>
  );
};

export default SearchHistoryPage;
