import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MemoSearchTextArea } from '../components';
import { useSearchMemoManager } from './hook';
import { SearchConversationList } from './components/SearchConversationList';
import { SearchConversation } from './components';
import { MemoEditModal } from '../dashboard/components';
import { BottomNavContext, SearchResetContext } from 'utils';

const SearchPage = () => {
  const { t } = useTranslation();

  const { isSmallScreen } = useContext(BottomNavContext);
  const { subscribeToReset, unsubscribeFromReset } = useContext(SearchResetContext);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState('');

  const searchMemoManager = useSearchMemoManager();

  const handleMessageChange = (e: ChangeEvent) => {
    setMessage((e.target as HTMLInputElement).value);
  };

  const handleSubmit = () => {
    if (message.trim().length === 0) {
      return;
    }

    searchMemoManager.handleSearchMemo(message);
    setMessage('');
  };

  useEffect(() => {
    const scrollToTop = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    subscribeToReset(scrollToTop);

    return () => {
      unsubscribeFromReset(scrollToTop);
    };
  }, []);

  return (
    <div className="flex flex-col justify-center overflow-hidden h-full">
      <div className="flex flex-col max-w-[740px] w-full self-center">
        <MemoSearchTextArea
          value={message}
          onChange={handleMessageChange}
          placeholder={t('pages.search.inputPlaceholder')}
          onSubmit={handleSubmit}
        />
      </div>

      <div
        ref={scrollContainerRef}
        className={`flex flex-col flex-1 w-full self-center overflow-scroll no-scrollbar ${isSmallScreen ? '' : 'mb-10'}`}
      >
        <div
          className={`max-w-[740px] w-full self-center ${isSmallScreen ? '' : 'mx-20'}`}
        >
          <SearchConversationList fetchNextPage={searchMemoManager.fetchNextPage}>
            {searchMemoManager.data.map((conversation, index) => {
              return (
                <SearchConversation
                  key={conversation.id || index}
                  data={conversation}
                />
              );
            })}
          </SearchConversationList>
        </div>
      </div>
      <MemoEditModal />
    </div>
  );
};

export default SearchPage;
