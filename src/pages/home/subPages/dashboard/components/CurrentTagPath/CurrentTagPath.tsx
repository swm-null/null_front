import { Dispatch, SetStateAction } from 'react';
import { Breadcrumbs } from '@mui/material';
import { UneditableTag } from 'pages/home/subPages/components';
import { RightIcon } from 'assets/icons';
import { Tag } from 'pages/home/subPages/interfaces';
import { TagPathButton } from './TagPathButton';

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
    <div className="flex flex-col w-full gap-4">
      <Breadcrumbs separator={<RightIcon />} aria-label="breadcrumb">
        <TagPathButton
          key="all"
          text={allTagText}
          invalidCharsPattern={invalidCharsPattern}
          onClick={handleAllTagsClick}
        />
        {tagStack.map((tag, index) => (
          <TagPathButton
            key={tag.id}
            text={tag.name}
            invalidCharsPattern={invalidCharsPattern}
            onClick={
              index !== tagStack.length - 1
                ? () => handleMiddleTagClick(index)
                : undefined
            }
          />
        ))}
      </Breadcrumbs>

      <div className="flex flex-1 overflow-hidden overflow-x-scroll no-scrollbar gap-1">
        {tags.map((tag, index) => (
          <UneditableTag
            key={index}
            text={`#${tag.name}`}
            color="peach1-transparent"
            fontColor="brown1"
            border
            invalidCharsPattern={invalidCharsPattern}
            onClick={() => handleChildTagClick(tag)}
          />
        ))}
      </div>
    </div>
  );
};

export default CurrentTagPath;
