import { Dispatch, SetStateAction } from 'react';
import { Breadcrumbs } from '@mui/material';
import { UneditableTag } from 'pages/home/contents/_components';
import { RightIcon } from 'assets/icons';
import { Tag } from 'pages/home/contents/_interfaces';

interface CurrentTagPathProps {
  allTagText: string;
  tagStack: Tag[];
  setTagStack: Dispatch<SetStateAction<Tag[]>>;
  tags: Tag[];
  handleTagOrAllTagsClick: (tag: Tag | null) => void;
  handleChildTagClick: (tag: Tag) => void;
  invalidCharsPattern: RegExp;
}

const CurrentTagPath = ({
  allTagText,
  tagStack,
  setTagStack,
  tags,
  handleTagOrAllTagsClick,
  handleChildTagClick,
  invalidCharsPattern,
}: CurrentTagPathProps) => {
  const handleAllTagsClick = () => {
    setTagStack([]);
    handleTagOrAllTagsClick(null);
  };

  const handleMiddleTagClick = (index: number) => {
    const newStack = tagStack.slice(0, index + 1);
    setTagStack(newStack);
    handleTagOrAllTagsClick(newStack[index]);
  };

  return (
    <div className="w-full px-4">
      <Breadcrumbs separator={<RightIcon />} aria-label="breadcrumb">
        <UneditableTag
          key="all"
          text={allTagText}
          color="transparent"
          invalidCharsPattern={invalidCharsPattern}
          onClick={handleAllTagsClick}
        />
        {tagStack.map((tag, index) => (
          <UneditableTag
            key={tag.id}
            text={tag.name}
            color="transparent"
            invalidCharsPattern={invalidCharsPattern}
            onClick={
              index !== tagStack.length - 1
                ? () => handleMiddleTagClick(index)
                : undefined
            }
          />
        ))}
      </Breadcrumbs>

      <div className="mt-2 flex flex-1 overflow-hidden overflow-x-scroll no-scrollbar gap-1">
        {tags.map((tag, index) => (
          <UneditableTag
            key={index}
            text={tag.name}
            invalidCharsPattern={invalidCharsPattern}
            onClick={() => handleChildTagClick(tag)}
          />
        ))}
      </div>
    </div>
  );
};

export default CurrentTagPath;
