import { FormEvent, useRef } from 'react';

interface TagCreateInputProps {
  value: string;
  addTag: (text: string) => void;
  /**
   * tag에 제외하고 싶은 문자 Regex 규칙 전달
   * ex: /[#,. \t\v\r\n\f\s]/g
   */
  tagInvalidCharsPattern: RegExp;
}
const TagCreateInput = ({
  value,
  addTag,
  tagInvalidCharsPattern,
}: TagCreateInputProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleInput = (e: FormEvent<HTMLDivElement>) => {
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
      className="flex flex-auto text-left focus:outline-none break-words self-center focus:self-center cursor:empty:before text-[10px] self"
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
    >
      {value}
    </div>
  );
};

export default TagCreateInput;
