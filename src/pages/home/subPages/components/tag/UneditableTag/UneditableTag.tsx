import { EditableTag } from 'pages/home/subPages/components';
import { HTMLProps } from 'react';

interface UneditableTagProps extends Omit<HTMLProps<HTMLDivElement>, 'size'> {
  text: string;
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
}

const UneditableTag = ({
  text,
  invalidCharsPattern,
  color,
  fontColor,
  borderRadius,
  borderOpacity,
  shadow,
  size = 'medium',
  ...divProps
}: UneditableTagProps) => {
  return (
    <EditableTag
      {...divProps}
      text={text}
      invalidCharsPattern={invalidCharsPattern}
      color={color}
      fontColor={fontColor}
      borderRadius={borderRadius}
      borderOpacity={borderOpacity}
      shadow={shadow}
      size={size}
    />
  );
};

export default UneditableTag;
