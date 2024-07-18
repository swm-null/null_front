import React, { useRef, useState } from 'react';
import { EditableTag } from 'components/ui/';
import { tagInvalidCharsPattern } from 'constants/memo/TagRule';
import { Tag } from 'interfaces/MemoInterface';

interface TagCreateInputProps {
  value: string;
  addTag: (text: string) => void;
}
const TagCreateInput = ({ value, addTag }: TagCreateInputProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    // text 업데이트 전, 다시 한번 invalidChars 필터링
    if (tagInvalidCharsPattern.test(e.currentTarget.innerText)) {
      const innerText = e.currentTarget.innerText.replace(
        tagInvalidCharsPattern,
        ''
      );
      addTag(innerText);
      e.currentTarget.innerText = '';
    }
  };

  return (
    <div
      className="flex flex-1 text-left focus:outline-none break-words self-center focus:self-center cursor:empty:before text-lg"
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
    >
      {value}
    </div>
  );
};

interface TagManagerProps {
  tags: Tag[];
  editable: boolean;
  setTags: (tags: Tag[]) => void;
}
export const TagManager = ({ tags, editable, setTags }: TagManagerProps) => {
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
          onTextChange={(text) => updateTag(index, text)}
          onDelete={() => deleteTag(index)}
          invalidCharsPattern={tagInvalidCharsPattern}
        />
      ))}
      {editable && <TagCreateInput value={tagInput} addTag={addTag} />}
    </div>
  );
};
