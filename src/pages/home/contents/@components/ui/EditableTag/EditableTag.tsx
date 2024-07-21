import { FormEvent, useRef } from 'react';

interface EditableTagProps {
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
  /**
   * 태그 delete 기능을 넣고 싶은 경우, delete 설정 메소드 전달
   */
  onDelete?: () => void;
  onClick?: () => void;
}

const EditableTag = ({
  text,
  editable = false,
  invalidCharsPattern,
  onTextChange,
  onDelete,
  onClick,
}: EditableTagProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  const handleInput = (e: FormEvent<HTMLSpanElement>) => {
    if (invalidCharsPattern.test(e.currentTarget.innerHTML)) {
      const innerText = e.currentTarget.innerText.replace(
        invalidCharsPattern,
        ''
      );
      e.currentTarget.innerText = innerText;
      ref.current?.blur();
      onTextChange && onTextChange(innerText);
    }
  };

  return (
    <div
      className={`inline-flex self-start items-center px-3 py-1 bg-blue-300 rounded-full ${onClick && 'cursor-pointer'}`}
      onClick={onClick}
    >
      <span
        className="focus:outline-none break-words"
        contentEditable={editable}
        ref={ref}
        suppressContentEditableWarning
        onInput={handleInput}
      >
        {text}
      </span>
      {editable && onDelete && (
        <svg
          className="ml-1 w-4 h-4 cursor-pointer"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={onDelete}
        >
          <path
            d="M5 5L19 19M5 19L19 5"
            stroke="#828282"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      )}
    </div>
  );
};

export default EditableTag;
