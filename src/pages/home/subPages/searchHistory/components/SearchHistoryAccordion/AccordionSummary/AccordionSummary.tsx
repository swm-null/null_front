import { DownIcon } from 'assets/icons';
import { MemoSearchConversation } from 'pages/home/subPages/interfaces';
import { LegacyRef } from 'react';

const AccordionSummary = ({
  isOpen,
  data,
  contentRef,
  formatDate,
}: {
  isOpen: boolean;
  data: MemoSearchConversation;
  contentRef: LegacyRef<HTMLParagraphElement>;
  formatDate: (date: string) => string;
}) => {
  return (
    <div className="px-5 py-4 flex justify-start cursor-pointer gap-[0.87rem]">
      <DownIcon
        className="text-brown1 flex-shrink-0 transition-transform duration-300"
        style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      />
      <p
        ref={isOpen ? undefined : contentRef}
        className={`text-base font-semibold text-brown2 ${
          isOpen
            ? 'whitespace-pre-wrap'
            : 'overflow-hidden whitespace-nowrap text-ellipsis'
        }`}
      >
        {data.query}
      </p>
      {!isOpen && (
        <p className="ml-auto text-sm font-regular text-brown2 flex-shrink-0">
          {formatDate(data.created_at)}
        </p>
      )}
    </div>
  );
};

export default AccordionSummary;
