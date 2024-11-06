import { FormEvent, useRef } from 'react';

interface TagPathButtonProps {
  text: string;
  editable?: boolean;
  /**
   * tag에 제외하고 싶은 문자 Regex 규칙 전달
   * ex: /[#,. \t\v\r\n\f\s]/g
   */
  invalidCharsPattern: RegExp;
  /**
   * tag의 text 변경사항을 받고 싶은 경우, text를 저장하는 메소드 전달
   */
  onTextChange?: (text: string) => void;
  onClick?: () => void;
}

const TagPathButton = ({
  text,
  editable = false,
  invalidCharsPattern,
  onTextChange,
  onClick,
}: TagPathButtonProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  const handleInput = (e: FormEvent<HTMLSpanElement>) => {
    if (invalidCharsPattern.test(e.currentTarget.innerHTML)) {
      const innerText = e.currentTarget.innerText.replace(invalidCharsPattern, '');
      e.currentTarget.innerText = innerText;
      ref.current?.blur();
      onTextChange && onTextChange(innerText);
    }
  };

  return (
    <div
      className={`inline-flex flex-shrink-0 bg-transparent text-[#6A5344] select-none 
        ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <span
        className="focus:outline-none whitespace-nowrap font-bold text-sm"
        contentEditable={editable}
        ref={ref}
        suppressContentEditableWarning
        onInput={handleInput}
      >
        {text}
      </span>
    </div>
  );
};

export default TagPathButton;
