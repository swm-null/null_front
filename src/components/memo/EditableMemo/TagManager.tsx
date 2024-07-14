import React, { useRef, useState } from 'react';
import { EditableTag } from 'components/ui/';
import { tagInvalidCharsPattern } from 'constants/memo/TagRule';

interface TagCreateInputProps{
  value: string
  addTag: (text: string) => void
}
const TagCreateInput = ({ value, addTag }: TagCreateInputProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    // text 업데이트 전, 다시 한번 invalidChars 필터링
    if (tagInvalidCharsPattern.test(e.currentTarget.innerText)) {
      const innerText = e.currentTarget.innerText.replace(tagInvalidCharsPattern, '');
      addTag(innerText)
      e.currentTarget.innerText='';
    }
  };

  return (
    <div
      className='flex flex-1 text-left focus:outline-none break-words self-center focus:self-center cursor:empty:before text-lg'
      ref={ ref }
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
    >{value}</div>
  );
};

interface TagManagerProps {
  tags: string[]
  editable: boolean
  setTags: (tags: string[]) => void
}
export const TagManager = ({ 
    tags, 
    editable, 
    setTags 
  }: TagManagerProps) => {
  const [tagInput, setTagInput] = useState('');

  // 새로운 tag 추가
  const addTag = (text: string) => {
    if (text) {
      setTagInput('');
      setTags([...tags, text]);
    }
  };

  // 기존에 있던 tag 내용 수정
  const updateTag = (index: number, newTag: string) => {
    const updatedTags = tags.map((tag, i) => (i === index ? newTag : tag));
    setTags(updatedTags);
  };

  // 기존에 있던 tag 내용 삭제
  const deleteTag = (index: number) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
  };

  return (
    <div className='flex flex-wrap gap-1'>
      {tags.map((tag, index) =>
        <EditableTag 
          key={index} text={tag} editable={editable} 
          onTextChange={(text) => updateTag(index, text)} onDelete={() => deleteTag(index)}
          invalidCharsPattern={tagInvalidCharsPattern}/>
      )}
      {editable && <TagCreateInput value={tagInput} addTag={addTag} />}
    </div>
  );
};
