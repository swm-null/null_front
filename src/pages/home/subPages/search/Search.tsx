import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MemoSearchTextArea } from '../components';
import { useSearchMemoManager } from './hook';
import { SearchConversationList } from './components/SearchConversationList';
import { MemoModal, SearchConversation } from './components';

const SearchPage = () => {
  const { t } = useTranslation();

  const [openConversationIds, setOpenConversationIds] = useState<Set<string>>(
    new Set()
  );
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
    const newOpenIds = new Set(openConversationIds);
    searchMemoManager.data.forEach((conversation) => {
      if (
        conversation.id &&
        !conversation.ai?.loading &&
        !conversation.db?.loading
      ) {
        newOpenIds.add(conversation.id);
      }
    });
    setOpenConversationIds(newOpenIds);
  }, [searchMemoManager.data]);

  return (
    <div className="flex justify-center overflow-hidden h-full">
      <div className="w-full max-w-[740px] h-full flex flex-col flex-1 text-gray3">
        <MemoSearchTextArea
          value={message}
          onChange={handleMessageChange}
          placeholder={t('pages.search.inputPlaceholder')}
          onSubmit={handleSubmit}
        />
        <div className={`overflow-scroll no-scrollbar`}>
          <SearchConversationList fetchNextPage={searchMemoManager.fetchNextPage}>
            {searchMemoManager.data.map((conversation, index) => {
              const isLoading = conversation.ai?.loading || conversation.db?.loading;
              if (isLoading) openConversationIds.add(index.toString());

              return (
                <SearchConversation
                  key={conversation.id || index}
                  data={conversation}
                  isOpen={openConversationIds.has(index.toString())}
                  onToggle={(isOpen: boolean) => {
                    const newOpenIds = new Set(openConversationIds);
                    if (isOpen) {
                      newOpenIds.add(index.toString());
                    } else {
                      newOpenIds.delete(index.toString());
                    }
                    setOpenConversationIds(newOpenIds);
                  }}
                />
              );
            })}
          </SearchConversationList>
        </div>
      </div>
      <MemoModal />
    </div>
  );
};

export default SearchPage;
