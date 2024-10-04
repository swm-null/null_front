import { Dispatch, SetStateAction } from 'react';
import { Breadcrumbs } from '@mui/material';
import { UneditableTag } from 'pages/home/subPages/components';
import { RightIcon } from 'assets/icons';
import { Tag } from 'pages/home/subPages/interfaces';

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
    <div className="w-full">
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
            color="#FFF6E3CC"
            invalidCharsPattern={invalidCharsPattern}
            onClick={() => handleChildTagClick(tag)}
          />
        ))}
      </div>
    </div>
  );
};

export default CurrentTagPath;
