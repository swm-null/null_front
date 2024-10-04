import { useState, useRef, useEffect } from 'react';
import { MemoSearchConversation } from 'pages/home/subPages/interfaces';
import { DownIcon } from 'assets/icons';

const SearchHistoryAccordion = ({ data }: { data: MemoSearchConversation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // useState로 드래그 상태 관리
  const contentRef = useRef<HTMLDivElement>(null);
  const mouseDownTime = useRef<number | null>(null);

  const handleMouseDown = () => {
    mouseDownTime.current = Date.now();
    setIsDragging(false);
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
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    if (isOpen) {
      contentRef.current?.style.setProperty(
        'height',
        `${contentRef.current.scrollHeight}px`
      );
    } else {
      contentRef.current?.style.setProperty('height', '0px');
    }
  }, [isOpen]);

  return (
    <div
      className="rounded-2xl cursor-pointer overflow-hidden border border-shadow0 shadow-custom"
      style={{
        backgroundColor: isOpen ? '#FFF6E3' : '#FFF6E366',
        transition: 'background-color 0.3s ease', // 배경색 전환 애니메이션
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="px-5 py-4 gap-[0.87rem] flex justify-between items-center">
        <DownIcon
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        />
        <span className="text-lg font-bold">{data.query}</span>
        <p className="ml-auto">date</p>
      </div>

      <div
        ref={contentRef}
        style={{
          height: '0px',
          overflow: 'hidden',
          transition: 'height 0.3s ease',
        }}
      >
        <div className="pr-4 pb-4 pl-[3.75rem]">
          <p>{data.answer.text}</p>
        </div>
      </div>
    </div>
  );
};

export default SearchHistoryAccordion;
