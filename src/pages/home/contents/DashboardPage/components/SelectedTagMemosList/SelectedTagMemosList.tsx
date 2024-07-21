import { ReactNode } from 'react';
import { Masonry } from '@mui/lab';

interface SelectedTagMemosListProps {
  children?: ReactNode;
}

const SelectedTagMemosList = ({ children }: SelectedTagMemosListProps) => {
  return (
    <div className="flex flex-col flex-1 overflow-y-scroll no-scrollbar my-4">
      {children ? (
        <Masonry columns={{ sm: 1, md: 2, lg: 3 }} spacing={2}>
          {children}
        </Masonry>
      ) : null}
    </div>
  );
};

export default SelectedTagMemosList;
