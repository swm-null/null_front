import { ReactNode } from 'react';
import { Divider } from '@mui/material';
import { UnEditableTag } from 'pages/home/contents/@components';

const TagList = ({
  children,
  allTagText,
  handleAllTagClick,
  invalidCharsPattern,
}: {
  children: ReactNode;
  allTagText: string;
  handleAllTagClick: () => void;
  invalidCharsPattern: RegExp;
}) => {
  return (
    <div className="flex w-full px-4 gap-2 overflow-hidden">
      <UnEditableTag
        key="all"
        text={allTagText}
        invalidCharsPattern={invalidCharsPattern}
        onClick={handleAllTagClick}
      />
      <Divider orientation="vertical" />
      <div className="flex flex-1 overflow-hidden overflow-x-scroll">
        <div className="flex flex-none gap-1 overflow-x-scroll">{children}</div>
      </div>
    </div>
  );
};

export default TagList;
