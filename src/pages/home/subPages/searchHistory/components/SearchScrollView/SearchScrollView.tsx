import { ReactNode, useRef } from 'react';

const SearchScrollView = ({
  children,
  searchTextArea,
}: {
  children: ReactNode;
  searchTextArea: ReactNode;
}) => {
  const scrollDirectionRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative flex flex-col flex-1 overflow-hidden">
      <div className="flex flex-col overflow-y-scroll no-scrollbar flex-1 w-full">
        <div ref={scrollDirectionRef} />
        <div className="flex flex-col gap-5 p-4">
          {searchTextArea}
          <div className="flex gap-[0.62rem] flex-col">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default SearchScrollView;
