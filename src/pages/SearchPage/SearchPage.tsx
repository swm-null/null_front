import { useSearchConversationManager } from './hook/useSearchConversationManager';
import { SIDEBAR_HEADER_ANIMATION_DURATION_SECOND } from 'constants/HeaderSideBarAnimation';
import { AnimatedHeader } from 'components/ui';
import { SearchInput, SearchScrollView } from './components';

export const SearchPage = ({
  headerLeftMarginToggle,
}: {
  headerLeftMarginToggle?: boolean;
}) => {
  const {
    searchConversations,
    addSearchConversation,
    editSearchConversation,
    removeSearchConversation,
  } = useSearchConversationManager();

  return (
    <div className="flex flex-col flex-1 h-screen text-gray2">
      <AnimatedHeader
        text={'메모 검색하기'}
        leftMarginToggle={headerLeftMarginToggle}
        animationDuration={SIDEBAR_HEADER_ANIMATION_DURATION_SECOND}
      />
      <SearchScrollView
        removeSearchConversation={removeSearchConversation}
        searchConversations={searchConversations}
      />
      <SearchInput
        addSearchConversation={addSearchConversation}
        editSearchConversation={editSearchConversation}
      />
    </div>
  );
};
