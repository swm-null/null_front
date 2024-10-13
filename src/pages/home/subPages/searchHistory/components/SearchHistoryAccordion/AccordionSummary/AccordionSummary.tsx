import { DownIcon } from 'assets/icons';
import { format } from 'date-fns';
import { MemoSearchConversation } from 'pages/home/subPages/interfaces';
import { useTranslation } from 'react-i18next';

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
}) => {
  const { t } = useTranslation();

  const formatDate = (date: string): string => {
    if (date.endsWith('Z')) {
      return format(new Date(date), t('memo.dateFormat'));
    }
    return format(`${date}Z`, t('memo.dateFormat'));
  };

  return (
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
      <p className="ml-auto text-sm font-regular text-brown2">
        {formatDate(data.createdAt)}
      </p>
    </div>
  );
};
export default AccordionSummary;
