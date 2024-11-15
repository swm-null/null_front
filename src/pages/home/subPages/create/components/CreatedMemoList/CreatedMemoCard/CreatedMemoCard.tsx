import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageMemoText } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { DeleteIcon, EditIcon, NoEditIcon } from 'assets/icons';
import { format } from 'date-fns';
import { Skeleton } from '@mui/material';
import { useMemoManager, UneditableTagList } from 'pages/home/subPages/components';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { EditOptions } from 'pages/home/subPages/components/memo/EditableMemo/EditOptions';
import { useImageList } from 'pages/home/subPages/hooks';
import { isFilesResponse, uploadFile, uploadFiles } from 'api';

interface CreatedMemoCardProps {
  memo: Memo;
}

const CreatedMemoCard = ({ memo }: CreatedMemoCardProps) => {
  const { t } = useTranslation();

  const [editable, setEditable] = useState(false);
  const [message, setMessage] = useState(memo.content);
  const [originImageUrls, setOriginalImageUrls] = useState(memo.image_urls);
  const {
    images,
    imageUrls: newImageUrls,
    handleImageFilesChange,
    removeImage,
  } = useImageList();

  const { handleUpdateMemo, handleDeleteMemo } = useMemoManager();

  const imageUrls = useMemo(
    () => [...originImageUrls, ...newImageUrls],
    [originImageUrls, newImageUrls]
  );

  const formatDate = (date: string): string => {
    if (date.endsWith('Z')) {
      return format(new Date(date), t('memo.dateFormat'));
    }
    return format(`${date}Z`, t('memo.dateFormat'));
  };

  const removeImageUrl = useCallback((index: number) => {
    if (index >= originImageUrls.length) {
      removeImage(index - originImageUrls.length);
    } else {
      setOriginalImageUrls((prev) => prev.filter((_, i) => i !== index));
    }
  }, []);

  const getFileUrls = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    const response =
      files.length === 1 ? await uploadFile(files[0]) : await uploadFiles(files);
    if (!isFilesResponse(response))
      throw new Error('파일 업로드에 문제가 생겼습니다.');

    return response.urls;
  };

  const handleUpdateMemoWithUploadFiles = async () => {
    try {
      const newImageUrls = await getFileUrls(images);

      handleUpdateMemo({
        memo,
        newMessage: message,
        newTags: memo.tags,
        newImageUrls: [...originImageUrls, ...newImageUrls],
        newVoiceUrls: memo.voice_urls,
        handlePreProcess: () => setEditable(false),
      });
    } catch {
      // FIXME: 에러 처리 어캐 하지...

      alert('메모 수정 실패');
    }
  };

  const toggleEditable = () => {
    if (editable) {
      setEditable(false);
      setMessage(memo.content);
      setOriginalImageUrls(memo.image_urls);
    } else {
      setEditable(true);
    }
  };

  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const haveLink = urlPattern.test(memo.content);

  const skeletonText =
    memo.voice_urls.length > 0
      ? '음성 분석 중...'
      : haveLink
        ? '링크 분석 중...'
        : memo.image_urls.length > 0
          ? '이미지 분석 중...'
          : '텍스트 분석 중...';

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
            <div className="rounded-2xl overflow-hidden">
              <Skeleton
                animation="wave"
                height={27}
                className="self-center content-center px-[0.5625rem] text-[10px]"
                style={{ transform: 'scale(1, 1)' }}
              >
                {skeletonText}
              </Skeleton>
            </div>
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
          imageUrls={imageUrls}
          message={message}
          removeImageUrl={removeImageUrl}
          metadata={memo.metadata}
          setMessage={setMessage}
          editable={editable}
          handleImageFilesChange={handleImageFilesChange}
        />
        {editable && (
          <EditOptions
            handleImageFilesChange={handleImageFilesChange}
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
            <NoEditIcon
              className="w-5 h-5 text-[#887262]"
              onClick={toggleEditable}
            />
          ) : (
            <EditIcon className="w-5 h-5 text-[#887262]" onClick={toggleEditable} />
          )}
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
