import { Memo } from 'pages/home/contents/@interfaces';
import { EditableMemo } from 'pages/home/contents/@components/memo';

const UneditableMemo = ({ memo }: { memo: Memo }) => {
  return <EditableMemo memo={memo} />;
};

export default UneditableMemo;
