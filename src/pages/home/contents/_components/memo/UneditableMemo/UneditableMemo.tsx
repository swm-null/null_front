import { Memo } from 'pages/home/contents/_interfaces';
import { EditableMemo } from 'pages/home/contents/_components/memo';

const UneditableMemo = ({ memo }: { memo: Memo }) => {
  return <EditableMemo memo={memo} />;
};

export default UneditableMemo;
