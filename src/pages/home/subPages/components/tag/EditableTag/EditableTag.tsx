import { CloseIcon } from 'assets/icons';
import { FormEvent, HTMLProps, useRef } from 'react';
import { tv } from 'tailwind-variants';

interface EditableTagProps extends Omit<HTMLProps<HTMLDivElement>, 'size'> {
  text: string;
  editable?: boolean;
  /**
   * tag에 제외하고 싶은 문자 Regex 규칙 전달
   * ex: /[#,. \t\v\r\n\f\s]/g
   */
  invalidCharsPattern: RegExp;
  /**
   * default: peach0
   */
  color?: 'white' | 'peach0' | 'peach1' | 'peach1-transparent' | 'peach2' | 'cream0';
  /**
   * default: black
   */
  fontColor?: 'brown0' | 'brown2' | 'black';
  /**
   * default: large
   */
  borderRadius?: 'small' | 'large';
  /**
   * 5 -> 5%
   * default: 10
   */
  borderOpacity?: 0 | 5 | 10;
  /**
   * tag에 그림자 효과를 줄 것인지 여부를 전달
   * default: false
   */
  shadow?: boolean;
  /**
   * default: medium
   */
  size?: 'small' | 'medium' | 'large';
  onTextChange?: (text: string) => void;
  onDelete?: () => void;
}

const tagStyles = tv({
  base: 'inline-flex shrink-0 self-center items-center h-5 py-[0.0625rem] px-[0.5625rem] gap-[5px]',
  variants: {
    color: {
      white: 'bg-white',
      peach0: 'bg-peach0',
      peach1: 'bg-peach1',
      'peach1-transparent': 'bg-peach1-transparent',
      peach2: 'bg-peach2',
      cream0: 'bg-cream0',
    },
    fontColor: {
      brown0: 'text-brown0',
      brown2: 'text-brown2',
      black: 'text-black',
    },
    radius: {
      small: 'rounded-lg',
      large: 'rounded-2xl',
    },
    border: {
      0: '',
      5: 'border border-solid border-black border-opacity-5 bg-clip-padding',
      10: 'border border-solid border-black border-opacity-10 bg-clip-padding',
    },
    shadow: {
      true: 'shadow-custom backdrop-blur-lg',
      false: '',
    },
    size: {
      small: 'h-5 text-[10px]',
      medium: 'h-6 text-[10px]',
      large: 'h-[27px] text-[12px]',
    },
  },
  defaultVariants: {
    color: 'peach0',
    fontColor: 'black',
    radius: 'large',
    border: 10,
    shadow: false,
    size: 'medium',
  },
});

const EditableTag = ({
  text,
  editable = false,
  invalidCharsPattern,
  color = 'peach0',
  fontColor = 'black',
  borderRadius = 'large',
  borderOpacity = 10,
  shadow = false,
  size = 'medium',
  onTextChange,
  onDelete,
  ...divProps
}: EditableTagProps) => {
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
      {...divProps}
      className={`${tagStyles({
        color: color,
        fontColor: fontColor,
        radius: borderRadius,
        border: borderOpacity,
        shadow: shadow,
        size: size,
      })}`}
    >
      <span
        className={`focus:outline-none whitespace-nowrap font-medium ${divProps.onClick ? 'cursor-pointer' : ''}`}
        contentEditable={editable}
        ref={ref}
        suppressContentEditableWarning
        onInput={handleInput}
      >
        {text}
      </span>
      {editable && onDelete && <CloseIcon className="w-3 h-3" onClick={onDelete} />}
    </div>
  );
};

export default EditableTag;
