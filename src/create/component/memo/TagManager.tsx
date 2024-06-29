import React, { useState } from 'react';
import { EditableTag } from './tag/EditableTag';
import { TagCreateInput } from './tag/TagCreateInput';

interface TagManagerProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  editable: boolean;
}

export const TagManager: React.FC<TagManagerProps> = ({ tags, setTags, editable }) => {
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
    const updatedTags = tags.filter((tag, i) => i !== index);
    setTags(updatedTags);
  };

  return (
    <div className='flex flex-wrap gap-1'>
      {tags.map((tag, index) =>
        <EditableTag key={index} text={tag} editable={editable} setText={(text) => updateTag(index, text)} onDelete={() => deleteTag(index)} />
      )}
      {editable && <TagCreateInput value={tagInput} addTag={addTag} />}
    </div>
  );
};
