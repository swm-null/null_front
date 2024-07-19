import { useSearchConversationManager } from './hook/useSearchConversationManager';
import { AnimatedHeader } from 'components/ui';
import { SearchInput, SearchScrollView } from './components';
import { SIDEBAR_HEADER_ANIMATION_DURATION } from 'config/constants';
import { useTranslation } from 'react-i18next';

export const SearchPage = ({
  headerLeftMarginToggle = false,
  headerLeftMargin = 0,
}: {
  headerLeftMarginToggle?: boolean;
  headerLeftMargin?: number;
}) => {
  const {
    searchConversations,
    addSearchConversation,
    editSearchConversation,
    removeSearchConversation,
  } = useSearchConversationManager();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col flex-1 h-screen text-gray2">
      <AnimatedHeader
        text={t('pages.search.header')}
        leftMarginToggle={headerLeftMarginToggle}
        leftMargin={headerLeftMargin}
        animationDuration={SIDEBAR_HEADER_ANIMATION_DURATION}
      />
      <div className="flex flex-col flex-1 overflow-hidden px-4">
        <SearchScrollView
          removeSearchConversation={removeSearchConversation}
          searchConversations={searchConversations}
        />
        <SearchInput
          addSearchConversation={addSearchConversation}
          editSearchConversation={editSearchConversation}
        />
      </div>
    </div>
  );
};
