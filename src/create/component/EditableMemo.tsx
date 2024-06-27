import React, { useEffect, useState } from 'react';
import { EditableTag } from '../../component/EditableTag';
import { TagCreateInput } from './memo/TagCreateInput';
import { Memo } from '../../search/interface/SearchResultInterface';

export const EditableMemo = ({memo, updateMemo, editable=false}: {
  memo: Memo
  updateMemo: (newMemo: Memo) => void
  editable?: boolean
}) => {
  const {id, content, tags: _tags} = memo;
  const [message, setMessage] = useState(content);
  const [tags, setTags] = useState(_tags);
  const [tagInput, setTagInput] = useState('');

  const handleMessageChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    const text = e.target.innerText;
    if (message !== text) {
      console.log(text)
      setMessage(text);
    }
  }
  const handleTagChange = (text: string) => {
    if (text) {
      setTagInput('');
      setTags(prev => [...prev, text]);
    }
  };
  
  const updateTag = (index:number, newTag:string) => {
    const updatedTags = tags.map((tag, i) => (i === index ? newTag : tag));
    setTags(updatedTags);
  };

  const deleteTag = (index: number) => {
    const updatedTags = tags.filter((tag, i) => i !== index);
    setTags(updatedTags);
  };

  const arraysEqual = (a: any[], b: any[]) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  useEffect(() => {
    const newMemo = { id, content: message, tags };
    if (memo.content !== newMemo.content || !arraysEqual(memo.tags, newMemo.tags)) {
      updateMemo(newMemo);
    }
  }, [id, message, tags, memo, updateMemo]);

  return (
    <div className='p-2 grid first-letter:flex-col rounded-md border-[1px]'>
      <div className='p-2 mb-2 w-full focus:outline-none resize-none rounded-xl'
        contentEditable={editable}
        suppressContentEditableWarning
        onChange={handleMessageChange}
        onBlur={handleMessageChange}
        >{content}</div>
      <div className='text-right'>
        <div className='flex flex-wrap gap-1'>
          {tags.map((tag, index) => 
            <EditableTag key={index} text={tag} editable={editable} setText={(text) => updateTag(index, text)} onDelete={() => deleteTag(index)}/>
          )}
          {editable && <TagCreateInput value={tagInput} onChange={handleTagChange}/>}
        </div>
        {editable && <button className="justify-self-end mt-2 bg-gray2 text-white rounded-full py-2 px-6">삭제</button>}
      </div>
    </div>
  );
};
