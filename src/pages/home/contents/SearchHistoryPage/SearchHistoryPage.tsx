import { useTranslation } from 'react-i18next';
import { Header } from 'pages/home/contents/_components';
import { MemoSearchConversation } from 'pages/home/contents/_interfaces';
import { SearchScrollView, SearchConversation } from './components';

const SearchHistoryPage = ({}: {}) => {
  const { t } = useTranslation();
  const searchConversations: MemoSearchConversation[] = JSON.parse(
    localStorage.getItem('search_queries') || '[]'
  );

  // FIXME: user마다 다른 user, chatbot 데이터 서버에서 관리하고, 거기서 데이터 가져오는 코드 추가
  const chatBotName = t('pages.search.ai.name');
  const chatBotImageUrl = t('pages.search.ai.url');

  return (
    <div className="flex flex-col flex-1 h-screen text-gray2">
      <Header headerText={t('pages.search.header')} />
      <div className="flex flex-col flex-1 overflow-hidden px-4">
        <SearchScrollView searchConversations={searchConversations}>
          {searchConversations.map((searchConversation) => (
            <SearchConversation
              key={searchConversation.id}
              data={searchConversation}
              chatBotImageUrl={chatBotImageUrl}
              chatBotName={chatBotName}
            />
          ))}
        </SearchScrollView>
      </div>
    </div>
  );
};

export default SearchHistoryPage;
