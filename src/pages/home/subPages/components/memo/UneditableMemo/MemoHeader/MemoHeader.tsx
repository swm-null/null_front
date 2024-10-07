import { Tag } from 'pages/home/subPages/interfaces';
import { UneditableTag } from '../../../ui';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';

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
      {/* TODO: pin 기능 나오면 추가 */}
      {/* <PinIcon className="ml-auto" /> */}
    </div>
  );
};

export default MemoHeader;
