import { ReactNode, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageMemoText } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { DeleteIcon, EditIcon } from 'assets/icons';
import { format } from 'date-fns';
import { Skeleton } from '@mui/material';
import { useMemoManager } from 'pages/home/subPages/components';
import { UneditableTagList } from 'pages/home/subPages/components';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { MemoContext } from 'utils';

interface CreatedMemoCardProps {
  memo: Memo;
}

const CreatedMemoCard = ({ memo }: CreatedMemoCardProps) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState(memo.content);

  const { handleDeleteMemo } = useMemoManager();
  const { openMemoEditModal } = useContext(MemoContext);

  const formatDate = (date: string): string => {
    if (date.endsWith('Z')) {
      return format(new Date(date), t('memo.dateFormat'));
    }
    return format(`${date}Z`, t('memo.dateFormat'));
  };

  return (
    <div
      className="flex items-start px-7 py-[1.88rem] bg-[#FFF6E3CC] border border-black border-opacity-10 
        bg-clip-padding rounded-xl shadow-custom backdrop-blur-lg"
    >
      <div className="flex flex-col w-full gap-9">
        <CreatedMemoCardHeader
          updatedAt={formatDate(memo.updated_at)}
          handleEditMemo={() => openMemoEditModal(memo)}
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
          metadata={memo.metadata}
          setMessage={setMessage}
        />
      </div>
    </div>
  );
};

const CreatedMemoCardHeader = ({
  updatedAt,
  handleEditMemo,
  handleDeleteMemo,
  children,
}: {
  updatedAt: string;
  handleEditMemo: () => void;
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
          <EditIcon className="w-5 h-5 text-[#887262]" onClick={handleEditMemo} />
        </button>
        <button type="button" className="rounded-full">
          <DeleteIcon
            className="w-5 h-5 text-[#887262]"
            onClick={handleDeleteMemo}
          />
        </button>
      </div>
    </div>
  );
};

export default CreatedMemoCard;
