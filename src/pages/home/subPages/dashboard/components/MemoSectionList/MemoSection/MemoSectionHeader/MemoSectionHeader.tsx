import { UneditableTag } from 'pages/home/subPages/components';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { Tag } from 'pages/home/subPages/interfaces';
import { DeleteIcon, EditIcon, RightIcon } from 'assets/icons';
import { useState } from 'react';

interface MemoSectionHeaderProps {
  tag: Tag;
  childTags: Tag[];
  handleTagClick: () => void;
}

const MemoSectionHeader = ({
  tag,
  childTags,
  handleTagClick,
}: MemoSectionHeaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(false);
  };

  const handleMouseMove = () => {
    setIsDragging(true);
  };

  const handleClick = () => {
    if (!isDragging && handleTagClick) {
      handleTagClick();
      setIsDragging(false);
    }
  };

  return (
    // FIXME: 일단 width 때러박고 나중에, css 만질때 수정하기
    <div
      className="flex flex-col px-3 py-4 bg-[#FFF6E380] gap-4 w-[268px]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <div className="flex w-full items-center gap-3">
        <p className="text-[#3e3e3e]">{tag.name}</p>
        <div className="flex gap-1">
          <EditIcon width="1.125rem" height="1.125rem" />
          <DeleteIcon className="text-brown1 w-[1.125rem] h-[1.125rem]" />
        </div>
        <div className="ml-auto flex items-center cursor-pointer">
          <RightIcon color="black" />
        </div>
      </div>
      <div className="flex overflow-hidden">
        <div className="flex gap-1 overflow-x-auto no-scrollbar flex-nowrap">
          {childTags.length > 0 ? (
            childTags.map((childTag, index) => (
              <UneditableTag
                key={index}
                className="px-2 py-1 h-6"
                text={`#${childTag.name}`}
                color="white"
                fontColor="brown2"
                border={5}
                invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
              />
            ))
          ) : (
            <div className="h-6" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoSectionHeader;
