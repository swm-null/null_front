import { DownIcon } from 'assets/icons';
import { MemoSearchConversation } from 'pages/home/subPages/interfaces';

const AccordionSummary = ({
  isOpen,
  data,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
}: {
  isOpen: boolean;
  data: MemoSearchConversation;
  handleMouseDown: () => void;
  handleMouseMove: () => void;
  handleMouseUp: () => void;
}) => (
  <div
    className="px-5 py-4 gap-[0.87rem] flex justify-between items-center cursor-pointer"
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
  >
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
);

export default AccordionSummary;
