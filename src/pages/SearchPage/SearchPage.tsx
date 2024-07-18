import { useSearchConversationManager } from './hook/useSearchConversationManager';
import { SIDEBAR_HEADER_ANIMATION_DURATION_SECOND } from 'constants/HeaderSideBarAnimationDurationConstant';
import { AnimatedHeader } from 'components/ui';
import { SearchInput, SearchScrollView } from './components';

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

  return (
    <div className="flex flex-col flex-1 h-screen text-gray2">
      <AnimatedHeader
        text={'메모 검색하기'}
        leftMarginToggle={headerLeftMarginToggle}
        leftMargin={headerLeftMargin}
        animationDuration={SIDEBAR_HEADER_ANIMATION_DURATION_SECOND}
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
