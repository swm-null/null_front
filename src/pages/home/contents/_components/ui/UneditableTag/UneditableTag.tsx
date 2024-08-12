import { EditableTag } from 'pages/home/contents/_components';

interface UneditableTagProps {
  text: string;
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
  onClick?: () => void;
}

const UneditableTag = ({
  text,
  invalidCharsPattern,
  color,
  onClick,
}: UneditableTagProps) => {
  return (
    <EditableTag
      text={text}
      invalidCharsPattern={invalidCharsPattern}
      color={color}
      onClick={onClick}
    />
  );
};

export default UneditableTag;
