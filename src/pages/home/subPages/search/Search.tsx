import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MemoSearchTextArea } from '../components';
import { useSearchMemoManager } from './hook';
import { SearchConversationList } from './components/SearchConversationList';
import { SearchConversation } from './components';
import { MemoEditModal } from '../dashboard/components';

const SearchPage = () => {
  const { t } = useTranslation();
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
