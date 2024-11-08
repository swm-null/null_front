import { format } from 'date-fns';

const MemoHeader = ({
  updatedAt,
  dateFormat,
}: {
  updatedAt: string;
  dateFormat: string;
}) => {
  const formatDate = (date: string): string => {
    if (date.endsWith('Z')) {
      return format(new Date(date), dateFormat);
    }
    return format(`${date}Z`, dateFormat);
  };

  return (
    <div className="flex gap-[1.44rem] items-center">
      <p className="ml-auto text-center font-medium text-sm text-brown2">
        {formatDate(updatedAt)}
      </p>
    </div>
  );
};

export default MemoHeader;
