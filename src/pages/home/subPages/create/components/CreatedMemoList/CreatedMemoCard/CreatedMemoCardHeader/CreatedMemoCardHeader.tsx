import { DeleteIcon, EditIcon, NoEditIcon } from 'assets/icons';
import { ReactNode } from 'react';

const CreatedMemoCardHeader = ({
  creating,
  editable,
  toggleEditable,
  updatedAt,
  handleDeleteMemo,
  children,
}: {
  creating: boolean;
  editable: boolean;
  toggleEditable: () => void;
  updatedAt: string;
  handleDeleteMemo: () => void;
  children: ReactNode;
}) => {
  return (
    <div className="flex flex-row flex-wrap-reverse flex-1 gap-2">
      {children}
      <div className="flex gap-2 ml-auto">
        <p className="text-[#6A5344] select-none content-center text-sm">
          {updatedAt}
        </p>
        {!creating && (
          <>
            <button type="button" className="rounded-full">
              {editable ? (
                <NoEditIcon
                  className="w-5 h-5 text-[#887262]"
                  onClick={toggleEditable}
                />
              ) : (
                <EditIcon
                  className="w-5 h-5 text-[#887262]"
                  onClick={toggleEditable}
                />
              )}
            </button>
            <button type="button" className="rounded-full">
              <DeleteIcon
                className="w-5 h-5 text-[#887262]"
                onClick={handleDeleteMemo}
              />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreatedMemoCardHeader;
