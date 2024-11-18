import { useEffect, useRef, useState } from 'react';
import {
  MemoSearchAnswerWithDB,
  MemoSearchAnswerWithAI,
  MemoSearchConversation,
} from 'pages/home/subPages/interfaces';
import { CircularProgress, Divider } from '@mui/material';
import { useHorizontalScroll } from 'pages/home/subPages/hooks';
import { useTranslation } from 'react-i18next';
import { SummaryMemoWithoutDrag } from 'pages/home/subPages/search/components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  }, [contentRef.current?.scrollHeight, isOpen, data.db, data.ai]);

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
  const { t } = useTranslation();

  const memoSearchAnswer = content ? content : { loading: false, memos: [] };

  return (
    <>
      {!memoSearchAnswer.loading ? (
        <div className="flex flex-col gap-[0.375rem]">
          {memoSearchAnswer.memos?.length ? (
            <ScrollableList>
              {memoSearchAnswer.memos?.map((memo) => (
                <div key={memo.id} className="rounded-lg w-60 h-fit flex-shrink-0">
                  <SummaryMemoWithoutDrag memo={memo} />
                </div>
              ))}
            </ScrollableList>
          ) : (
            <p className="text-gray3 font-regular text-[11px]">
              {t('pages.search.conversation.noResults')}
            </p>
          )}
        </div>
      ) : (
        <div className="flex gap-3 text-sm">
          <CircularProgress className="self-center" size={15} />
          <p className="text-gray3 font-regular text-[11px]">
            {t('pages.search.conversation.db.searching')}
          </p>
        </div>
      )}
    </>
  );
};

const AIAnswer = ({ content }: { content: MemoSearchAnswerWithAI | null }) => {
  const { t } = useTranslation();

  const memoSearchAnswer = content
    ? content
    : { loading: false, processed_message: '', memos: [] };

  return (
    <>
      {!memoSearchAnswer.loading ? (
        <div className="flex flex-col gap-5">
          {memoSearchAnswer.processed_message && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="font-regular text-brown2 whitespace-break-spaces [&>br]:display-none"
              disallowedElements={['br']}
              components={{
                ol: ({ node, ...props }) => (
                  <ol {...props} className={`${props.className || ''} grid`}>
                    {props.children}
                  </ol>
                ),
                li: ({ node, ...props }) => (
                  <li
                    {...props}
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                    }}
                  >
                    {props.children}
                  </li>
                ),
                a: ({ node, ...props }) => (
                  <a {...props} className={`${props.className || ''} underline`}>
                    {props.children}
                  </a>
                ),
              }}
            >
              {memoSearchAnswer.processed_message}
            </ReactMarkdown>
          )}
          {memoSearchAnswer.memos?.length ? (
            <ScrollableList>
              {memoSearchAnswer.memos?.map((memo) => (
                <div key={memo.id} className="rounded-lg h-fit w-60 flex-shrink-0">
                  <SummaryMemoWithoutDrag memo={memo} />
                </div>
              ))}
            </ScrollableList>
          ) : null}
          {!memoSearchAnswer.processed_message &&
            !memoSearchAnswer.memos?.length && (
              <p className="text-gray3 font-regular text-[11px]">
                {t('pages.search.conversation.noResults')}
              </p>
            )}
        </div>
      ) : (
        <div className="flex gap-3 text-sm">
          <CircularProgress className="self-center" size={15} />
          <p className="text-gray3 font-regular text-[11px]">
            {t('pages.search.conversation.ai.generating')}
          </p>
        </div>
      )}
    </>
  );
};

export default ConversationContent;
