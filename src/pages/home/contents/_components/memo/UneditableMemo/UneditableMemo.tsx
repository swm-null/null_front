import { Memo } from 'pages/home/contents/_interfaces';
import { EditableMemo } from 'pages/home/contents/_components/memo';

const UneditableMemo = ({
  memo,
  color,
}: {
  memo: Memo;
  /**
   * 메모에 적용하고 싶은 배경색을 string으로 전달
   * ex) #000000, tailwind에 적용되어있는 color
   */
  color?: string;
}) => {
  return <EditableMemo memo={memo} color={color} />;
};

export default UneditableMemo;
