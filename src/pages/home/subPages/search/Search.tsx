import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MemoSearchTextArea } from '../components';
import { useSearchMemoManager } from './hook';
import { SearchConversationList } from './components/SearchConversationList';
import { SearchConversation } from './components';

const SearchPage = () => {
  const { t } = useTranslation();

  const [message, setMessage] = useState('');

  const searchMemoManager = useSearchMemoManager();

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (message: string) => {
    searchMemoManager.handleSearchMemo(message);
  };

  return (
    <div className="flex justify-center overflow-hidden h-full">
      <div className="max-w-[740px] h-full flex flex-col flex-1 text-gray3">
        <MemoSearchTextArea
          value={message}
          onChange={handleMessageChange}
          placeholder={t('pages.search.inputPlaceholder')}
          onSubmit={() => handleSubmit(message)}
        />
        <div className={`overflow-scroll no-scrollbar`}>
          <SearchConversationList fetchNextPage={searchMemoManager.fetchNextPage}>
            {searchMemoManager.data.map((conversation) => (
              <SearchConversation data={conversation} />
            ))}
          </SearchConversationList>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
