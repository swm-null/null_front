import { Dispatch, SetStateAction, useContext } from 'react';
import { Breadcrumbs } from '@mui/material';
import { RightIcon } from 'assets/icons';
import { Tag } from 'pages/home/subPages/interfaces';
import { TagPathButton } from './TagPathButton';
import { SortToggle } from './SortToggle';
import { SortOption } from 'pages/home/subPages/types';
import { UneditableTagList } from 'pages/home/subPages/components';
import { TagContext } from 'utils';

interface CurrentTagPathProps {
  allTagText: string;
  tagStack: Tag[];
  setTagStack: Dispatch<SetStateAction<Tag[]>>;
  tags: Tag[];
  handleTagOrAllTagsClick: (tag: Tag | null) => void;
  handleChildTagClick: (tag: Tag) => void;
  sortOption: SortOption;
  setSortOption: (sortOption: SortOption) => void;
  invalidCharsPattern: RegExp;
}

const CurrentTagPath = ({
  allTagText,
  tagStack,
  setTagStack,
  tags,
  handleTagOrAllTagsClick,
  handleChildTagClick,
  sortOption,
  setSortOption,
  invalidCharsPattern,
}: CurrentTagPathProps) => {
  const { onReset } = useContext(TagContext);

  const handleAllTagsClick = () => {
    onReset();
    setTagStack([]);
    handleTagOrAllTagsClick(null);
  };

  const handleMiddleTagClick = (index: number) => {
    history.pushState(
      {
        tagStack: tagStack,
      },
      '',
      window.location.href
    );

    const newStack = tagStack.slice(0, index + 1);
    setTagStack(newStack);
    handleTagOrAllTagsClick(newStack[index]);
  };

  return (
    <div className="flex flex-col w-full">
      <Breadcrumbs
        className="px-4"
        separator={<RightIcon />}
        aria-label="breadcrumb"
      >
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

      <div className="flex w-full flex-wrap p-4 pb-2 gap-2">
        <div className="flex max-w-full mr-auto">
          <UneditableTagList
            tags={tags}
            size="large"
            color="cream0"
            borderOpacity={10}
            invalidCharsPattern={invalidCharsPattern}
            onChildTagClick={handleChildTagClick}
          />
        </div>
        <div className="flex ml-auto w-fit">
          <SortToggle
            height="1.6875rem"
            fontSize="0.75rem"
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
        </div>
      </div>
    </div>
  );
};

export default CurrentTagPath;
