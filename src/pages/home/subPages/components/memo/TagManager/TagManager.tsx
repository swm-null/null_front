import { useState } from 'react';
import { EditableTag } from 'pages/home/subPages/components';
import { TagCreateInput } from './TagCreateInput';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { Tag } from 'pages/home/subPages/interfaces';

interface TagManagerProps {
  tags: Tag[];
  editable: boolean;
  /**
   * tag에 적용하고 싶은 배경색을 string으로 전달
   * ex) #000000, tailwind에 적용되어있는 color
   */
  color?: string;
  setTags: (tags: Tag[]) => void;
}
const TagManager = ({ tags, editable, color, setTags }: TagManagerProps) => {
  const [tagInput, setTagInput] = useState('');

  // 새로운 tag 추가
  // FIXME: 현재는 임시로 tag id 생성 후, 화면에 보여주게 구현.
  // 나중에 server와 통신해서 tag 생성하는 기능 연동하기
  const addTag = (text: string) => {
    if (text) {
      setTagInput('');
      setTags([...tags, { id: 'temp', name: text }]);
    }
  };

  // 기존에 있던 tag 내용 수정
  // FIXME: 현재는 임시로 tag id 생성 후, 화면에 보여주게 구현.
  // 나중에 server와 통신해서 tag 새로 생성하는 기능 연동하기
  const updateTag = (index: number, newTagName: string) => {
    const updatedTags = tags.map((tag, i) =>
      i === index ? { id: 'temp', name: newTagName } : tag
    );
    setTags(updatedTags);
  };

  // 기존에 있던 tag 내용 삭제
  const deleteTag = (index: number) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
  };

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag, index) => (
        <EditableTag
          key={index}
          text={tag.name}
          editable={editable}
          color={color}
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
