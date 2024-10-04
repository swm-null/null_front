import { useState, useRef } from 'react';
import { MemoSearchConversation } from 'pages/home/subPages/interfaces';
import { DownIcon } from 'assets/icons';
import { MemosList, UneditableMemo } from 'pages/home/subPages/components';

const SearchHistoryAccordion = ({ data }: { data: MemoSearchConversation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const mouseDownTime = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    mouseDownTime.current = Date.now();
  };

  const handleMouseMove = () => {
    if (
      mouseDownTime.current !== null &&
      Date.now() - mouseDownTime.current > 100
    ) {
      setIsDragging(true);
    }
  };

  const handleMouseUp = () => {
    mouseDownTime.current = null;
    if (!isDragging) {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div
      className="rounded-2xl cursor-pointer overflow-hidden border border-shadow0 shadow-custom"
      style={{
        backgroundColor: isOpen ? '#FFF6E3' : '#FFF6E366',
        transition: 'background-color 0.3s ease',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="px-5 py-4 gap-[0.87rem] flex justify-between items-center">
        <DownIcon
          className="text-brown1"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        />
        <p className="text-base font-semibold text-brown2">{data.query}</p>
        <p className="ml-auto text-base font-regular text-brown2">date</p>
      </div>

      <div
        ref={contentRef}
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
        }}
      >
        <div className="flex flex-col flex-1 gap-4 px-5 pb-5">
          <p className="pr-2 pl-9 font-regular text-brown2">
            {data.answer.text}
          </p>
          <MemosList>
            {data.answer.memos?.map((memo) => (
              <UneditableMemo key={memo.id} memo={memo} />
            ))}
          </MemosList>
        </div>
      </div>
    </div>
  );
};

export default SearchHistoryAccordion;
