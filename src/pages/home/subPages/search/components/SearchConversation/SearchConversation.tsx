import { format } from 'date-fns';
import { MemoSearchConversation } from 'pages/home/subPages/interfaces';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConversationSummary } from './ConversationSummary';
import { ConversationContent } from './ConversationContent';

const SearchConversation = ({ data }: { data: MemoSearchConversation }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(
    !data.ai?.loading || !data.db?.loading ? false : true
  );
  const contentRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: string): string => {
    const formattedDate = date.endsWith('Z') ? date : `${date}Z`;
    return format(new Date(formattedDate), t('memo.dateFormat'));
  };

  return (
    <div
      className="flex flex-shrink-0 flex-col w-full rounded-2xl border border-black border-opacity-10 bg-clip-padding shadow-custom"
      style={{
        backgroundColor: isOpen ? '#FFF6E3' : '#FFF6E366',
        transition: 'background-color 0.3s ease',
      }}
    >
      <ConversationSummary
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        data={data}
        formatDate={formatDate}
      />
      <ConversationContent
        isOpen={isOpen}
        contentRef={contentRef}
        data={data}
        formatDate={formatDate}
      />
    </div>
  );
};

export default SearchConversation;
