import { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MemoSearchConversation } from 'pages/home/subPages/interfaces';
import { BottomNavContext } from 'utils';
import { useIntersectionObserver } from 'pages/home/subPages/hooks';
import SearchConversation from './SearchConversation';

interface SearchConversationListProps {
  searchConversations: MemoSearchConversation[];
  fetchNextPage: () => void;
}

const SearchConversationList = ({
  searchConversations,
  fetchNextPage,
}: SearchConversationListProps) => {
  const { t } = useTranslation();
  const { isSmallScreen, bottomNavHeight } = useContext(BottomNavContext);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useIntersectionObserver(observerRef, {
    callback: (entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    },
    options: { threshold: 0.5 },
  });

  return (
    <div
      className="flex flex-col p-4 pt-0"
      style={{ paddingBottom: isSmallScreen ? bottomNavHeight + 24 : 0 }}
    >
      <div className="flex flex-col gap-3">
        {searchConversations.map((conversation) => (
          <div key={conversation.id} className="flex flex-col h-full">
            <div
              className="px-2 py-6 w-full flex-1 rounded-xl border-[1px] overflow-scroll
                border-black border-opacity-10 bg-clip-padding bg-[#FFF6E3CC] font-regular"
            >
              <SearchConversation
                data={conversation}
                chatBotName={t('pages.search.ai.name')}
              />
            </div>
          </div>
        ))}
      </div>
      <div ref={observerRef} className="min-h-[1px] bg-transparent" />
    </div>
  );
};

export default SearchConversationList;
