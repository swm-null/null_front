import { useRef, useState } from 'react';
import { MemoSearchConversation } from 'pages/home/subPages/interfaces';
import { AccordionSummary } from './AccordionSummary';
import { AccordionContent } from './AccordionContent';
import { v4 as uuid_v4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useClickWithoutDrag } from 'pages/home/subPages/hooks';

const SearchHistoryAccordion = ({ data }: { data: MemoSearchConversation }) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  const { handleMouseDown, handleMouseMove, handleClick } = useClickWithoutDrag(() =>
    setIsOpen((prev) => !prev)
  );

  const formatDate = (date: string): string => {
    const formattedDate = date.endsWith('Z') ? date : `${date}Z`;
    return format(new Date(formattedDate), t('memo.dateFormat'));
  };

  return (
    <div
      key={data.id || uuid_v4()}
      className="flex flex-shrink-0 flex-col w-full rounded-2xl border border-shadow0 shadow-custom"
      style={{
        backgroundColor: isOpen ? '#FFF6E3' : '#FFF6E366',
        transition: 'background-color 0.3s ease',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <AccordionSummary
        isOpen={isOpen}
        contentRef={contentRef}
        data={data}
        formatDate={formatDate}
      />
      <AccordionContent
        isOpen={isOpen}
        contentRef={contentRef}
        data={data}
        formatDate={formatDate}
      />
    </div>
  );
};

export default SearchHistoryAccordion;
