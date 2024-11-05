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
   * tag에 적용하고 싶은 배경색을 전달
   * default: peach0
   */
  color?: 'white' | 'peach0' | 'peach1' | 'peach1-transparent' | 'peach2' | 'cream0';
  /**
   * tag font에 적용하고 싶은 색을 전달
   * default: black
   */
  fontColor?: 'brown0' | 'brown2' | 'black';
  /**
   * tag의 border-radius 크기를 string으로 전달
   * 'small', 'large'와 같이 사용
   * default: large
   */
  radius?: 'small' | 'large';
  /**
   * tag의 border opacity를 숫자로 전달
   * 5 -> 5%
   * default: 10
   */
  border?: 0 | 5 | 10;
  /**
   * tag에 그림자 효과를 줄 것인지 여부를 전달
   * default: false
   */
  shadow?: boolean;
  /**
   * tag의 크기를 설정
   * default: large
   */
  size?: 'small' | 'medium' | 'large';
}

const UneditableTag = ({
  text,
  invalidCharsPattern,
  color,
  fontColor,
  radius,
  border,
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
      radius={radius}
      border={border}
      shadow={shadow}
      size={size}
    />
  );
};

export default UneditableTag;
