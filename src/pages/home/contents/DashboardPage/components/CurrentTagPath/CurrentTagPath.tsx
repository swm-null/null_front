import { ReactNode } from 'react';
import { Breadcrumbs } from '@mui/material';
import { UneditableTag } from 'pages/home/contents/@components';
import { RightIcon } from 'assets/icons';
import { Tag } from 'pages/home/contents/@interfaces';

const CurrentTagPath = ({
  children,
  allTagText,
  tagStack,
  onTagClickAtIndex,
  onAllTagClick,
  invalidCharsPattern,
}: {
  children: ReactNode;
  allTagText: string;
  tagStack: Tag[];
  onTagClickAtIndex: (index: number) => void;
  onAllTagClick: () => void;
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
          onClick={onAllTagClick}
        />
        {tagStack.map((tag, index) => (
          <UneditableTag
            key={tag.id}
            text={tag.name}
            color="transparent"
            invalidCharsPattern={invalidCharsPattern}
            // 마지막 태그는 클릭 안되게 구현
            onClick={
              index !== tagStack.length - 1
                ? () => onTagClickAtIndex(index)
                : undefined
            }
          />
        ))}
      </Breadcrumbs>
      <div className="mt-2 flex flex-1 overflow-hidden overflow-x-scroll">
        <div className="flex flex-none gap-1 overflow-x-scroll">{children}</div>
      </div>
    </div>
  );
};

export default CurrentTagPath;
