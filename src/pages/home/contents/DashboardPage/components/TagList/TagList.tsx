import { ReactNode } from 'react';
import { Breadcrumbs } from '@mui/material';
import { UneditableTag } from 'pages/home/contents/@components';
import { RightIcon } from 'assets/icons';

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
    <div className="w-full px-4">
      <Breadcrumbs separator={<RightIcon />} aria-label="breadcrumb">
        <UneditableTag
          key="all"
          text={allTagText}
          color="transparent"
          invalidCharsPattern={invalidCharsPattern}
          onClick={handleAllTagClick}
        />
        <UneditableTag
          key="all"
          text={allTagText}
          color="transparent"
          invalidCharsPattern={invalidCharsPattern}
        />
        <UneditableTag
          key="all"
          text={allTagText}
          color="transparent"
          invalidCharsPattern={invalidCharsPattern}
        />
        <UneditableTag
          key="all"
          text={allTagText}
          color="transparent"
          invalidCharsPattern={invalidCharsPattern}
        />
      </Breadcrumbs>
      <div className="mt-2 flex flex-1 overflow-hidden overflow-x-scroll">
        <div className="flex flex-none gap-1 overflow-x-scroll">{children}</div>
      </div>
    </div>
  );
};

export default TagList;
