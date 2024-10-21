import { DeleteIcon } from 'assets/icons';
import { format } from 'date-fns';

const MemoFooter = ({
  updatedAt,
  dateFormat,
  textColor,
  handleDeleteMemo,
}: {
  updatedAt: string;
  dateFormat: string;
  textColor: string;
  handleDeleteMemo: () => void;
}) => {
  const formatDate = (date: string): string => {
    if (date.endsWith('Z')) {
      return format(new Date(date), dateFormat);
    }
    return format(`${date}Z`, dateFormat);
  };

  return (
    <div className="flex flex-1 items-center" style={{ color: textColor }}>
      <p className="font-medium text-[10px]">{formatDate(updatedAt)}</p>

      <button
        className="text-right justify-self-end ml-auto rounded-full"
        onClick={handleDeleteMemo}
      >
        <DeleteIcon className="w-[1.125rem] h-[1.125rem]" />
      </button>
    </div>
  );
};

export default MemoFooter;
