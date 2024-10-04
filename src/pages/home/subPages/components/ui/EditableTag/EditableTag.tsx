import { CloseIcon } from 'assets/icons';
import { FormEvent, useRef } from 'react';
import { tv } from 'tailwind-variants';

interface EditableTagProps {
  text: string;
  editable?: boolean;
  /**
   * tag에 제외하고 싶은 문자 Regex 규칙 전달
   * ex: /[#,. \t\v\r\n\f\s]/g
   */
  invalidCharsPattern: RegExp;
  /**
   * tag에 적용하고 싶은 배경색을 전달
   * default: peach0
   */
  color?: 'white' | 'peach0' | 'peach1' | 'peach1-transparent' | 'peach2';
  /**
   * tag font에 적용하고 싶은 색을 전달
   * default: black
   */
  fontColor?: 'brown0' | 'brown1' | 'black';
  /**
   * tag의 border-radius 크기를 string으로 전달
   * 'small', 'large'와 같이 사용
   * default: large
   */
  radius?: 'small' | 'large';
  border?: boolean;
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

const tagStyles = tv({
  base: 'inline-flex flex-shrink-0 self-start items-center px-3 py-[5.5px] gap-[5px]',
  variants: {
    color: {
      white: 'bg-white',
      peach0: 'bg-peach0',
      peach1: 'bg-peach1',
      'peach1-transparent': 'bg-peach1-transparent',
      peach2: 'bg-peach2',
    },
    fontColor: {
      brown0: 'text-brown0',
      brown1: 'text-brown1',
      black: 'text-black',
    },
    radius: {
      small: 'rounded-lg',
      large: 'rounded-2xl',
    },
    border: {
      true: 'border border-solid border-shadow0',
      false: '',
    },
  },
  defaultVariants: {
    color: 'peach0',
    fontColor: 'black',
    radius: 'large',
    border: false,
  },
});

const EditableTag = ({
  text,
  editable = false,
  invalidCharsPattern,
  color = 'peach0',
  fontColor = 'black',
  radius = 'large',
  border = false,
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
      className={tagStyles({
        color: color,
        fontColor: fontColor,
        radius: radius,
        border: border,
      })}
      onClick={onClick}
    >
      <span
        className="focus:outline-none whitespace-nowrap text-xs"
        contentEditable={editable}
        ref={ref}
        suppressContentEditableWarning
        onInput={handleInput}
      >
        {text}
      </span>
      {editable && onDelete && (
        <CloseIcon className="w-3 h-3" onClick={onDelete} />
      )}
    </div>
  );
};

export default EditableTag;
