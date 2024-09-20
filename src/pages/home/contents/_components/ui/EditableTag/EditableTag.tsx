import { CloseIcon } from 'assets/icons';
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
   * tag에 적용하고 싶은 배경색을 string으로 전달
   * ex) #000000, tailwind에 적용되어있는 color
   */
  color?: string;
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
  color,
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
      className={`inline-flex flex-shrink-0 self-start items-center px-3 py-1 ${color ? `bg-[${color}]` : 'bg-[#F7DBC2]'} rounded-2xl ${onClick && 'cursor-pointer'}`}
      onClick={onClick}
    >
      <span
        className="focus:outline-none break-words text-[#6A5344]"
        contentEditable={editable}
        ref={ref}
        suppressContentEditableWarning
        onInput={handleInput}
      >
        {text}
      </span>
      {editable && onDelete && <CloseIcon onClick={onDelete} />}
    </div>
  );
};

export default EditableTag;
