import { DeleteIcon } from 'assets/icons';
import { format } from 'date-fns';
import { MouseEvent } from 'react';

const MemoFooter = ({
  updatedAt,
  dateFormat,
  textColor,
  handleDeleteMemo,
  readonly,
}: {
  updatedAt: string | null;
  dateFormat: string;
  textColor: string;
  handleDeleteMemo: () => void;
  readonly?: boolean;
}) => {
  const formatDate = (date: string): string => {
    if (date.endsWith('Z')) {
      return format(new Date(date), dateFormat);
    }
    return format(`${date}Z`, dateFormat);
  };

  const handleDeleteMemoWidthEvent = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleDeleteMemo();
  };

  return (
    <div className="flex items-center mt-auto" style={{ color: textColor }}>
      <p className="font-medium text-[10px]">{updatedAt && formatDate(updatedAt)}</p>

      {!readonly && (
        <button
          className="text-right justify-self-end ml-auto rounded-full"
          onClick={handleDeleteMemoWidthEvent}
        >
          <DeleteIcon className="w-[1.125rem] h-[1.125rem]" />
        </button>
      )}
    </div>
  );
};

export default MemoFooter;
