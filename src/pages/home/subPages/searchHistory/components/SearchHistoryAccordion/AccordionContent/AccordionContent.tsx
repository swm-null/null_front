import { MemosList, UneditableMemo } from 'pages/home/subPages/components';
import { MemoSearchConversation } from 'pages/home/subPages/interfaces';

const AccordionContent = ({
  isOpen,
  contentRef,
  data,
}: {
  isOpen: boolean;
  contentRef: React.RefObject<HTMLDivElement>;
  data: MemoSearchConversation;
}) => (
  <div
    ref={contentRef}
    style={{
      maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
      overflow: 'hidden',
      transition: 'max-height 0.3s ease',
    }}
  >
    <div className="flex flex-col flex-1 gap-4 px-5 pb-5">
      <p className="pr-2 pl-9 font-regular text-brown2">{data.answer.text}</p>
      {data.answer.memos?.length !== 0 && (
        <MemosList>
          {data.answer.memos?.map((memo) => (
            <UneditableMemo key={memo.id} memo={memo} />
          ))}
        </MemosList>
      )}
    </div>
  </div>
);

export default AccordionContent;
