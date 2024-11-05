import { Tag } from 'pages/home/subPages/interfaces';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { UneditableTag } from 'pages/home/subPages/components';

const MemoHeader = ({ tags }: { tags: Tag[] }) => {
  return (
    <div className="flex items-center">
      <div className="flex flex-1 gap-1 overflow-x-auto ">
        {tags.map((tag, index) => (
          <UneditableTag
            key={index}
            text={`#${tag.name}`}
            invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
            color="peach0"
            fontColor="brown0"
            radius="small"
            border={0}
          />
        ))}
      </div>
    </div>
  );
};

export default MemoHeader;
