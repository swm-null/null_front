import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { UneditableMemo, UneditableTag } from 'pages/home/contents/_components';
import { Memo, Tag } from 'pages/home/contents/_interfaces';

interface TaggedMemosListProps {
  tag: Tag;
  childTags: Tag[];
  memos: Memo[];
  handleMemoClick: (memo: Memo, tag: Tag, index: number) => void;
}

const TaggedMemosList = ({
  tag,
  childTags,
  memos,
  handleMemoClick,
}: TaggedMemosListProps) => {
  return (
    <div className="w-[300px] flex-shrink-0 py-2">
      <div className="px-2 py-4 bg-[#989898] rounded-t-2xl">
        <p className="mb-2 text-black">{tag.name}</p>
        <div className="flex gap-2 overflow-x-scroll w-full no-scrollbar">
          {childTags.map((childTag, index) => (
            <UneditableTag
              key={index}
              text={childTag.name}
              invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
            />
          ))}
        </div>
      </div>
      <div className="overflow-y-auto no-scrollbar max-h-[calc(100vh-200px)] py-2">
        <div className="grid grid-cols-1 gap-4">
          {memos.map((memo, index) => (
            <UneditableMemo
              key={memo.id}
              memo={memo}
              onClick={() => handleMemoClick(memo, tag, index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaggedMemosList;
