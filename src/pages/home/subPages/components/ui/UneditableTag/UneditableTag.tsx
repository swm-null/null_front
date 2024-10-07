import { EditableTag } from 'pages/home/subPages/components';

interface UneditableTagProps {
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
  color?: 'white' | 'peach0' | 'peach1' | 'peach1-transparent' | 'peach2';
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
  border?: 0 | 5 | 10;
  shadow?: boolean;
  onClick?: () => void;
  /**
   * 추가적인 className을 설정할 수 있는 prop
   */
  className?: string;
}

const UneditableTag = ({
  text,
  invalidCharsPattern,
  color,
  fontColor,
  radius,
  border,
  shadow,
  onClick,
  className,
}: UneditableTagProps) => {
  return (
    <EditableTag
      text={text}
      invalidCharsPattern={invalidCharsPattern}
      color={color}
      fontColor={fontColor}
      radius={radius}
      border={border}
      shadow={shadow}
      onClick={onClick}
      className={className}
    />
  );
};

export default UneditableTag;
