import { useState, useRef } from 'react';
import { MemoSearchConversation } from 'pages/home/subPages/interfaces';
import { AccordionSummary } from './AccordionSummary';
import { AccordionContent } from './AccordionContent';
import { v4 as uuid_v4 } from 'uuid';

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
    setIsDragging(false);
  };

  return (
    <div
      key={data.id || uuid_v4()}
      className="rounded-2xl overflow-hidden border border-shadow0 shadow-custom"
      style={{
        backgroundColor: isOpen ? '#FFF6E3' : '#FFF6E366',
        transition: 'background-color 0.3s ease',
      }}
    >
      <AccordionSummary
        isOpen={isOpen}
        data={data}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
      />
      <AccordionContent isOpen={isOpen} contentRef={contentRef} data={data} />
    </div>
  );
};

export default SearchHistoryAccordion;
