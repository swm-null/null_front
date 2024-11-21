import { ReactNode, useCallback, useContext } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Memo } from 'pages/home/subPages/interfaces';
import { DeleteIcon, EditIcon, NoEditIcon } from 'assets/icons';
import { format } from 'date-fns';
import { Skeleton } from '@mui/material';
import {
  UneditableTagList,
  ImageMemoText,
  useDeleteMemoManager,
  useUpdateMemoManager,
} from 'pages/home/subPages/components';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { EditOptions } from 'pages/home/subPages/components/memo/EditableMemo/EditOptions';
import { useImageList } from 'pages/home/subPages/hooks';
import { RecordingContext } from 'utils';

interface CreatedMemoCardProps {
  memo: Memo;
}

const CreatedMemoCard = ({ memo }: CreatedMemoCardProps) => {
  const { t } = useTranslation();

  const [editable, setEditable] = useState(false);
  const [message, setMessage] = useState(memo.content);
  const [tagRebuild, setTagRebuild] = useState(false);

  const [originImageUrls, setOriginalImageUrls] = useState(memo.image_urls);
  const {
    images,
    imageUrls: newImageUrls,
    handleImageFilesChange,
    removeImage,
    handlePaste,
  } = useImageList();

  const { handleUpdateMemo } = useUpdateMemoManager();
  const { handleDeleteMemo } = useDeleteMemoManager();

  const { openRecordingModal } = useContext(RecordingContext);

  const imageUrls = useMemo(
    () => [...originImageUrls, ...newImageUrls],
    [originImageUrls, newImageUrls]
  );

  const [audio, setAudio] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(memo.voice_urls[0]);

  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const haveLink = urlPattern.test(memo.content);

  const skeletonTexts = [
    memo.voice_urls.length > 0 && '음성 분석 중...',
    haveLink && '링크 분석 중...',
    memo.image_urls.length > 0 && '이미지 분석 중...',
    memo.content && '텍스트 분석 중...',
  ].filter(Boolean);

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

  const removeVoiceUrl = () => {
    setAudioUrl(null);
  };

  const handleSubmit = () => {
    setEditable(false);
    handleUpdateMemo({
      memo,
      tagRebuild,
      newContent: message,
      newImages: images,
      newVoice: audio,
      oldImageUrls: originImageUrls,
      oldVoiceUrls: audioUrl ? [audioUrl] : [],
    });
  };

  const handleMicButtonClick = () => {
    openRecordingModal(audio, setAudio);
  };

  const toggleEditable = () => {
    if (editable) {
      setEditable(false);
      setMessage(memo.content);
      setOriginalImageUrls(memo.image_urls);
      setAudioUrl(memo.voice_urls[0]);
    } else {
      setEditable(true);
    }
  };

  useEffect(() => {
    audio && setAudioUrl(URL.createObjectURL(audio));
  }, [audio]);

  return (
    <div
      className="flex items-start px-7 py-[1.88rem] bg-[#FFF6E3CC] border border-black border-opacity-10 
        bg-clip-padding rounded-xl shadow-custom backdrop-blur-lg"
    >
      <div className="flex flex-col w-full gap-9">
        <CreatedMemoCardHeader
          creating={memo.tags.length === 0}
          editable={editable}
          toggleEditable={toggleEditable}
          updatedAt={memo.updated_at ? formatDate(memo.updated_at) : ''}
          handleDeleteMemo={() => handleDeleteMemo({ memo })}
        >
          {memo.tags.length === 0 ? (
            skeletonTexts.map((skeletonText, index) => (
              <div key={index} className="rounded-2xl overflow-hidden">
                <Skeleton
                  animation="wave"
                  height={27}
                  className="self-center content-center px-[0.5625rem] text-[10px]"
                  style={{ transform: 'scale(1, 1)' }}
                >
                  {skeletonText}
                </Skeleton>
              </div>
            ))
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
          key={audioUrl}
          voiceUrl={audioUrl}
          imageUrls={imageUrls}
          message={message}
          removeImageUrl={removeImageUrl}
          removeVoiceUrl={removeVoiceUrl}
          metadata={memo.metadata}
          setMessage={setMessage}
          editable={editable}
          handleImageFilesChange={handleImageFilesChange}
          handlePaste={handlePaste}
        />
        {editable && (
          <EditOptions
            tagRebuildable
            tagRebuild={tagRebuild}
            setTagRebuild={setTagRebuild}
            handleMicButtonClick={handleMicButtonClick}
            handleImageFilesChange={handleImageFilesChange}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

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

export default CreatedMemoCard;
