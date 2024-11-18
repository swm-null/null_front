import { DeleteIcon } from 'assets/icons';
import { format } from 'date-fns';
import { UneditableTagList } from 'pages/home/subPages/components';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { Tag } from 'pages/home/subPages/interfaces';

const MemoHeader = ({
  tags,
  updatedAt,
  dateFormat,
  handleDeleteMemo,
}: {
  tags: Tag[];
  updatedAt: string | null;
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
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex mr-auto">
        <UneditableTagList
          tags={tags}
          size="large"
          color="peach2"
          borderOpacity={0}
          invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
        />
      </div>
      <div className="ml-auto flex gap-4">
        {updatedAt && (
          <p className="text-center font-medium text-sm text-brown2">
            {formatDate(updatedAt)}
          </p>
        )}
        <DeleteIcon
          className="text-brown2 w-5 h-5 flex-shrink-0 cursor-pointer"
          onClick={handleDeleteMemo}
        />
      </div>
    </div>
  );
};

export default MemoHeader;
