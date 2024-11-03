import { format } from 'date-fns';
import { useClickWithoutDrag } from 'pages/home/subPages/hooks';
import { MemoSearchConversation } from 'pages/home/subPages/interfaces';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConversationSummary } from './ConversationSummary';
import { ConversationContent } from './ConversationContent';

const SearchConversation = ({ data }: { data: MemoSearchConversation }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { handleMouseDown, handleMouseMove, handleClick } = useClickWithoutDrag(() =>
    setIsOpen((prev) => !prev)
  );

  const formatDate = (date: string): string => {
    const formattedDate = date.endsWith('Z') ? date : `${date}Z`;
    return format(new Date(formattedDate), t('memo.dateFormat'));
  };

  return (
    <div
      className="flex flex-shrink-0 flex-col w-full rounded-2xl border border-shadow0 shadow-custom"
      style={{
        backgroundColor: isOpen ? '#FFF6E3' : '#FFF6E366',
        transition: 'background-color 0.3s ease',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <ConversationSummary isOpen={isOpen} data={data} formatDate={formatDate} />
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
