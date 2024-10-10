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
  const formatDate = (date: Date): string => {
    return format(date, dateFormat);
  };

  return (
    <div className="flex gap-[1.44rem] items-center">
      <PinIcon className="mr-auto" width={'1.5rem'} height={'1.5rem'} />
      <p className="text-center font-medium text-sm text-brown2">
        {formatDate(new Date(updatedAt + 'Z'))}
      </p>
      <DeleteIcon className="text-brown2 w-5 h-5" onClick={handleDeleteMemo} />
    </div>
  );
};

export default MemoHeader;
