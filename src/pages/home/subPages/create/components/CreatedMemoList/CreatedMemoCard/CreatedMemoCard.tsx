import { ReactNode, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageMemoText } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { DeleteIcon, EditIcon, NoEditIcon } from 'assets/icons';
import { format } from 'date-fns';
import { Skeleton } from '@mui/material';
import { useMemoManager, UneditableTagList } from 'pages/home/subPages/components';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { ImageListContext } from 'utils';
import { EditOptions } from 'pages/home/subPages/components/memo/EditableMemo/EditOptions';

interface CreatedMemoCardProps {
  memo: Memo;
}

const CreatedMemoCard = ({ memo }: CreatedMemoCardProps) => {
  const { t } = useTranslation();

  const [editable, setEditable] = useState(false);
  const [message, setMessage] = useState(memo.content);
  const { handleImageFilesChange, handleAddImageButtonClick } =
    useContext(ImageListContext);

  const { handleDeleteMemo } = useMemoManager();

  const formatDate = (date: string): string => {
    if (date.endsWith('Z')) {
      return format(new Date(date), t('memo.dateFormat'));
    }
    return format(`${date}Z`, t('memo.dateFormat'));
  };

  const handleUpdateMemoWithUploadFiles = async () => {};

  const toggleEditable = () => {
    if (editable) {
      setEditable(false);
      setMessage(memo.content);
    } else {
      setEditable(true);
    }
  };

  return (
    <div
      className="flex items-start px-7 py-[1.88rem] bg-[#FFF6E3CC] border border-black border-opacity-10 
        bg-clip-padding rounded-xl shadow-custom backdrop-blur-lg"
    >
      <div className="flex flex-col w-full gap-9">
        <CreatedMemoCardHeader
          editable={editable}
          toggleEditable={toggleEditable}
          updatedAt={formatDate(memo.updated_at)}
          handleDeleteMemo={() => handleDeleteMemo({ memo })}
        >
          {memo.tags.length === 0 ? (
            <Skeleton animation="wave" width={50} />
          ) : (
            <UneditableTagList
              tags={memo.tags}
              size="large"
              color="peach2"
              borderOpacity={0}
              invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
            />
          )}
        </CreatedMemoCardHeader>
        <ImageMemoText
          imageUrls={memo.image_urls}
          message={message}
          setMessage={setMessage}
          editable={editable}
        />
        {editable && (
          <EditOptions
            handleImageFilesChange={handleImageFilesChange}
            handleAddImageButtonClick={handleAddImageButtonClick}
            handleUpdateMemoWithUploadFiles={handleUpdateMemoWithUploadFiles}
          />
        )}
      </div>
    </div>
  );
};

const CreatedMemoCardHeader = ({
  editable,
  toggleEditable,
  updatedAt,
  handleDeleteMemo,
  children,
}: {
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
        <button type="button" className="rounded-full">
          {editable ? (
            <NoEditIcon className="w-5 h-5" onClick={toggleEditable} />
          ) : (
            <EditIcon className="w-5 h-5" onClick={toggleEditable} />
          )}
        </button>
        <button type="button" className="rounded-full">
          <DeleteIcon onClick={handleDeleteMemo} />
        </button>
      </div>
    </div>
  );
};

export default CreatedMemoCard;
