import { useTranslation } from 'react-i18next';
import { AnimatedHeader } from 'pages/home/contents/_components';
import { SIDEBAR_HEADER_ANIMATION_DURATION } from 'pages/home/constants';
import { SearchScrollView, SearchConversation } from './components';
import { MemoSearchConversation } from '../_interfaces';

const SearchHistoryPage = ({
  headerLeftMarginToggle = false,
  headerLeftMargin = 0,
}: {
  headerLeftMarginToggle?: boolean;
  headerLeftMargin?: number;
}) => {
  const { t } = useTranslation();
  const searchConversations: MemoSearchConversation[] = JSON.parse(
    localStorage.getItem('search_queries') || '[]'
  );

  // FIXME: user마다 다른 user, chatbot 데이터 서버에서 관리하고, 거기서 데이터 가져오는 코드 추가
  const chatBotName = t('pages.search.ai.name');
  const chatBotImageUrl = t('pages.search.ai.url');

  return (
    <div className="flex flex-col flex-1 h-screen text-gray2">
      <AnimatedHeader
        text={t('pages.search.header')}
        leftMarginToggle={headerLeftMarginToggle}
        leftMargin={headerLeftMargin}
        animationDuration={SIDEBAR_HEADER_ANIMATION_DURATION}
      />
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
