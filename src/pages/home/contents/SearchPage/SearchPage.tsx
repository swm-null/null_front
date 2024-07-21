import { useTranslation } from 'react-i18next';
import { AnimatedHeader } from 'pages/home/contents/@components';
import { SIDEBAR_HEADER_ANIMATION_DURATION } from 'pages/home/constants';
import {
  SearchInput,
  SearchScrollView,
  SearchConversation,
} from './components';
import { useSearchConversationManager } from './hook';

const SearchPage = ({
  headerLeftMarginToggle = false,
  headerLeftMargin = 0,
}: {
  headerLeftMarginToggle?: boolean;
  headerLeftMargin?: number;
}) => {
  const { t } = useTranslation();
  const {
    searchConversations,
    addSearchConversation,
    editSearchConversation,
    removeSearchConversation,
  } = useSearchConversationManager();

  // FIXME: user마다 다른 user, chatbot 데이터 서버에서 관리하고, 거기서 데이터 가져오는 코드 추가
  const userName = t('pages.search.user.name');
  const chatBotName = t('pages.search.ai.name');
  const userImageUrl = t('pages.search.user.url');
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
              userName={userName}
              userImageUrl={userImageUrl}
              chatBotImageUrl={chatBotImageUrl}
              chatBotName={chatBotName}
              removeSearchConversation={removeSearchConversation}
            />
          ))}
        </SearchScrollView>
        <SearchInput
          addSearchConversation={addSearchConversation}
          editSearchConversation={editSearchConversation}
        />
      </div>
    </div>
  );
};

export default SearchPage;
