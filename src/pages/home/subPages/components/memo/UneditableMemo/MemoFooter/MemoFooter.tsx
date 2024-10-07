import { DeleteIcon } from 'assets/icons';
import { format } from 'date-fns';

const MemoFooter = ({
  updatedAt,
  dateFormat,
  handleDeleteMemo,
}: {
  updatedAt: string;
  dateFormat: string;
  handleDeleteMemo: () => void;
}) => {
  const formatDate = (date: Date): string => {
    return format(date, dateFormat);
  };

  return (
    <div className="flex flex-1 items-center">
      <p className="text-gray2 font-medium text-[10px]">
        {formatDate(new Date(updatedAt))}
      </p>

      <button
        className="text-right justify-self-end ml-auto rounded-full"
        onClick={handleDeleteMemo}
      >
        <DeleteIcon className="text-gray2 w-[1.125rem] h-[1.125rem]" />
      </button>
    </div>
  );
};

export default MemoFooter;
