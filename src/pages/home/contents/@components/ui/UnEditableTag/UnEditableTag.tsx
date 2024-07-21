import { EditableTag } from 'pages/home/contents/@components';

interface UnEditableTagProps {
  text: string;
  /**
   * tag에 제외하고 싶은 문자 Regex 규칙 전달
   * ex: /[#,. \t\v\r\n\f\s]/g
   */
  invalidCharsPattern: RegExp;
  onClick?: () => void;
}

const UnEditableTag = ({
  text,
  invalidCharsPattern,
  onClick,
}: UnEditableTagProps) => {
  return (
    <EditableTag
      text={text}
      invalidCharsPattern={invalidCharsPattern}
      onClick={onClick}
    />
  );
};

export default UnEditableTag;
