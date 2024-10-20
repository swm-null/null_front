import { useState } from 'react';
import { EditableTag } from 'pages/home/subPages/components';
import { TagCreateInput } from './TagCreateInput';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { Tag } from 'pages/home/subPages/interfaces';

interface TagManagerProps {
  tags: Tag[];
  editable?: boolean;
  setTags: (tags: Tag[]) => void;
}
const TagManager = ({ tags, editable, setTags }: TagManagerProps) => {
  const [tagInput, setTagInput] = useState('');

  // FIXME: 현재는 임시로 tag id 생성 후, 화면에 보여주게 구현.
  // 나중에 server와 통신해서 tag 생성하는 기능 연동하기
  const addTag = (text: string) => {
    if (text) {
      setTagInput('');
      setTags([...tags, { id: 'temp', name: text }]);
    }
  };

  // FIXME: 현재는 임시로 tag id 생성 후, 화면에 보여주게 구현.
  // 나중에 server와 통신해서 tag 새로 생성하는 기능 연동하기
  const updateTag = (index: number, newTagName: string) => {
    const updatedTags = tags.map((tag, i) =>
      i === index ? { id: 'temp', name: newTagName } : tag
    );
    setTags(updatedTags);
  };

  const deleteTag = (index: number) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
  };

  return (
    <div className="flex flex-wrap gap-1 flex-row items-center">
      {tags.map((tag, index) => (
        <EditableTag
          key={index}
          text={tag.name}
          editable={editable}
          color="peach2"
          border={0}
          onTextChange={(text) => updateTag(index, text)}
          onDelete={() => deleteTag(index)}
          invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
        />
      ))}
      {editable && (
        <TagCreateInput
          value={tagInput}
          addTag={addTag}
          tagInvalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
        />
      )}
    </div>
  );
};

export default TagManager;
