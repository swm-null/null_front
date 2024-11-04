import { useEffect, useState } from 'react';
import { MemosList, UneditableMemo } from 'pages/home/subPages/components';
import {
  MemoSearchAnswer,
  MemoSearchConversation,
} from 'pages/home/subPages/interfaces';
import { CircularProgress } from '@mui/material';

const ConversationContent = ({
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
  }, [contentRef.current?.scrollHeight, isOpen]);

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
        <AIAnswer content={data.search_memos_response} />
        {isOpen && (
          <p className="ml-auto text-sm font-regular text-brown2 flex-shrink-0">
            {formatDate(data.created_at)}
          </p>
        )}
      </div>
    </div>
  );
};

const AIAnswer = ({ content }: { content: MemoSearchAnswer | null }) => {
  return (
    <div className="pl-[38px]">
      {content ? (
        <div className="flex flex-col gap-[0.375rem]">
          <p className="font-regular text-brown2 whitespace-break-spaces">
            {content.processed_message}
          </p>
          {content.memos?.length ? (
            <MemosList>
              {content.memos?.map((memo) => (
                <div key={memo.id} className="inline rounded-lg min-w-72">
                  <UneditableMemo memo={memo} />
                </div>
              ))}
            </MemosList>
          ) : null}
        </div>
      ) : (
        <div className="flex gap-3 text-sm">
          <CircularProgress className="self-center" size={15} />
          <p className="text-gray3 font-regular text-[11px]">답변을 생성중입니다.</p>
        </div>
      )}
    </div>
  );
};

export default ConversationContent;
