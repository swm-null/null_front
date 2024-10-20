import { MemosList, UneditableMemo } from 'pages/home/subPages/components';
import { MemoSearchConversation } from 'pages/home/subPages/interfaces';
import { useEffect, useState } from 'react';

const AccordionContent = ({
  isOpen,
  contentRef,
  data,
  formatDate,
}: {
  isOpen: boolean;
  contentRef: React.RefObject<HTMLDivElement>;
  data: MemoSearchConversation;
  formatDate: (date: string) => string;
}) => {
  const [accordionHeight, setAccordionHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setAccordionHeight(contentRef.current.scrollHeight);
    }
  }, [contentRef.current?.scrollHeight]);

  return (
    <div
      ref={contentRef}
      style={{
        maxHeight: isOpen ? `${accordionHeight}px` : '0px',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease',
      }}
    >
      <div className="flex flex-col flex-1 gap-4 px-5 pb-5">
        <p className="pr-2 pl-[38px] font-regular text-brown2 whitespace-break-spaces">
          {data.search_memos_response?.processed_message}
        </p>
        {data.search_memos_response?.memos?.length !== 0 && (
          <MemosList>
            {data.search_memos_response?.memos?.map((memo) => (
              <UneditableMemo key={memo.id} memo={memo} />
            ))}
          </MemosList>
        )}
        {isOpen && (
          <p className="ml-auto text-sm font-regular text-brown2 flex-shrink-0">
            {formatDate(data.created_at)}
          </p>
        )}
      </div>
    </div>
  );
};

export default AccordionContent;
