import { useEffect, useRef, useState } from 'react';
import { UneditableMemo } from 'pages/home/subPages/components';
import {
  MemoSearchAnswerWithDB,
  MemoSearchAnswerWithAI,
  MemoSearchConversation,
} from 'pages/home/subPages/interfaces';
import { CircularProgress, Divider } from '@mui/material';
import { useHorizontalScroll } from 'pages/home/subPages/hooks';

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
      <div className="flex flex-col flex-1 gap-4 px-5 pb-5 pl-[58px]">
        <DBAnswer content={data.db} />
        <Divider />
        <AIAnswer content={data.ai} />
        {isOpen && (
          <p className="ml-auto text-sm font-regular text-brown2 flex-shrink-0">
            {formatDate(data.created_at)}
          </p>
        )}
      </div>
    </div>
  );
};

const ScrollableList = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { onDragStart, onDragMove, onDragEnd } = useHorizontalScroll({ scrollRef });

  return (
    <div className="flex w-full overflow-hidden">
      <div
        ref={scrollRef}
        className="flex overflow-x-scroll gap-3 no-scrollbar"
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
      >
        {children}
      </div>
    </div>
  );
};

const DBAnswer = ({ content }: { content: MemoSearchAnswerWithDB | null }) => {
  const memoSearchAnswer = content ? content : { loading: false, memos: [] };

  return (
    <>
      {!memoSearchAnswer.loading ? (
        <div className="flex flex-col gap-[0.375rem]">
          {memoSearchAnswer.memos?.length ? (
            <ScrollableList>
              {memoSearchAnswer.memos?.map((memo) => (
                <div key={memo.id} className="rounded-lg h-60 w-60 flex-shrink-0">
                  <UneditableMemo memo={memo} />
                </div>
              ))}
            </ScrollableList>
          ) : (
            <p className="text-gray3 font-regular text-[11px]">
              검색 결과가 없습니다.
            </p>
          )}
        </div>
      ) : (
        <div className="flex gap-3 text-sm">
          <CircularProgress className="self-center" size={15} />
          <p className="text-gray3 font-regular text-[11px]">검색 중입니다.</p>
        </div>
      )}
    </>
  );
};

const AIAnswer = ({ content }: { content: MemoSearchAnswerWithAI | null }) => {
  const memoSearchAnswer = content
    ? content
    : { loading: false, processed_message: '', memos: [] };

  return (
    <>
      {!memoSearchAnswer.loading ? (
        <div className="flex flex-col gap-5">
          <p className="font-regular text-brown2 whitespace-break-spaces">
            {memoSearchAnswer.processed_message}
          </p>
          {memoSearchAnswer.memos?.length ? (
            <ScrollableList>
              {memoSearchAnswer.memos?.map((memo) => (
                <div key={memo.id} className="rounded-lg h-60 w-60 flex-shrink-0">
                  <UneditableMemo memo={memo} />
                </div>
              ))}
            </ScrollableList>
          ) : null}
        </div>
      ) : (
        <div className="flex gap-3 text-sm">
          <CircularProgress className="self-center" size={15} />
          <p className="text-gray3 font-regular text-[11px]">답변을 생성중입니다.</p>
        </div>
      )}
    </>
  );
};

export default ConversationContent;
