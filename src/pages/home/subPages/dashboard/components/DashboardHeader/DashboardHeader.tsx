import { useContext } from 'react';
import { Breadcrumbs, CircularProgress } from '@mui/material';
import { AddIcon, RightIcon } from 'assets/icons';
import { Tag } from 'pages/home/subPages/interfaces';
import { TagPathButton } from './TagPathButton';
import { SortToggle } from './SortToggle';
import { SortOption } from 'pages/home/subPages/types';
import { UneditableTagList } from 'pages/home/subPages/components';
import { ResetContext, TagContext } from 'utils';

interface DashboardHeaderProps {
  allTagText: string;
  tags: Tag[];
  handleTagOrAllTagsClick: (tag: Tag | null) => void;
  handleChildTagClick: (tag: Tag) => void;
  sortOption: SortOption;
  setSortOption: (sortOption: SortOption) => void;
  invalidCharsPattern: RegExp;
}

const DashboardHeader = ({
  allTagText,
  tags,
  handleTagOrAllTagsClick,
  handleChildTagClick,
  sortOption,
  setSortOption,
  invalidCharsPattern,
}: DashboardHeaderProps) => {
  const { selectedTag, onTagReset, tagStack, setTagStack, openTagCreateModal } =
    useContext(TagContext);
  const { onReset } = useContext(ResetContext);

  const handleAllTagsClick = () => {
    onTagReset();
    onReset('dashboard');
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

  const handleCreateTag = () => {
    openTagCreateModal(selectedTag);
    try {
    } catch {}
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full">
        <Breadcrumbs
          className="px-4"
          separator={<RightIcon />}
          aria-label="breadcrumb"
        >
          <TagPathButton
            key="all"
            tag={{ id: '@', name: allTagText }}
            onClick={handleAllTagsClick}
          />
          {tagStack.map((tag, index) => (
            <TagPathButton
              key={tag.id}
              tag={tag}
              isCurrentTag={index === tagStack.length - 1}
              onClick={() => handleMiddleTagClick(index)}
            />
          ))}
        </Breadcrumbs>
        <p className="flex ml-auto pr-4 text-sm self-center gap-2 text-[#6A5344E6]">
          배치 중입니다
          <CircularProgress className="self-center" size={14} />
        </p>
      </div>

      <div className="flex w-full flex-wrap p-4 pb-2 gap-2">
        <div className="flex max-w-full mr-auto gap-1">
          <UneditableTagList
            tags={tags}
            size="large"
            color="cream0"
            borderOpacity={10}
            invalidCharsPattern={invalidCharsPattern}
            onChildTagClick={handleChildTagClick}
          />
          <AddIcon
            className="text-brown2 bg-cream0 p-[7px] h-[27px] w-[27px] rounded-full cursor-pointer
            border border-black border-opacity-10 bg-clip-padding"
            onClick={handleCreateTag}
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

export default DashboardHeader;
