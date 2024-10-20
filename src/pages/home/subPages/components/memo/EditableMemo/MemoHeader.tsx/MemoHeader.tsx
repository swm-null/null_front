import { DeleteIcon, PinIcon } from 'assets/icons';
import { format } from 'date-fns';

const MemoHeader = ({
  updatedAt,
  dateFormat,
  handleDeleteMemo,
}: {
  updatedAt: string;
  dateFormat: string;
  handleDeleteMemo: () => void;
}) => {
  const formatDate = (date: string): string => {
    if (date.endsWith('Z')) {
      return format(new Date(date), dateFormat);
    }
    return format(`${date}Z`, dateFormat);
  };

  return (
    <div className="flex gap-[1.44rem] items-center">
      <PinIcon className="mr-auto" width={'1.5rem'} height={'1.5rem'} />
      <p className="text-center font-medium text-sm text-brown2">
        {formatDate(updatedAt)}
      </p>
      <DeleteIcon className="text-brown2 w-5 h-5" onClick={handleDeleteMemo} />
    </div>
  );
};

export default MemoHeader;
