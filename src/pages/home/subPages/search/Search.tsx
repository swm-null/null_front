import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MemoSearchTextArea } from '../components';
import { useSearchMemoManager } from './hook';
import { SearchConversationList } from './components/SearchConversationList';
import { SearchConversation } from './components';
import { MemoEditModal } from '../dashboard/components';
import { BottomNavContext, SearchResetContext } from 'utils';
import { useVerticalScrollOpacity } from '../hooks';

const SearchPage = () => {
  const { t } = useTranslation();

  const { isSmallScreen } = useContext(BottomNavContext);
  const { subscribeToReset, unsubscribeFromReset } = useContext(SearchResetContext);

  const [message, setMessage] = useState('');

  const searchMemoManager = useSearchMemoManager();
  const { scrollRef, scrollOpacity } = useVerticalScrollOpacity();

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
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
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
        ref={scrollRef}
        className={`flex flex-col flex-1 w-full self-center overflow-scroll no-scrollbar ${isSmallScreen ? '' : 'mb-10'}`}
        style={{
          maskImage: `linear-gradient(to bottom, rgba(0, 0, 0, ${scrollOpacity.top}) 0.1%, rgba(0, 0, 0, 1) 5%, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, ${scrollOpacity.bottom}) 99.9%)`,
          WebkitMaskImage: `linear-gradient(to bottom, rgba(0, 0, 0, ${scrollOpacity.top}) 0.1%, rgba(0, 0, 0, 1) 5%, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, ${scrollOpacity.bottom}) 99.9%)`,
        }}
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
