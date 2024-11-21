import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ImageMemoText,
  useCreateMemoManager,
  useDeleteMemoManager,
  useUpdateMemoManager,
} from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { MemoHeader } from './MemoHeader';
import { MemoContext, RecordingContext } from 'utils';
import { EditOptions } from './EditOptions';
import { useImageList } from 'pages/home/subPages/hooks';

const EditableMemo = ({
  memo,
  border,
  handlePreProcess,
}: {
  memo: Memo;
  border?: boolean;
  handlePreProcess: () => void;
}) => {
  const { t } = useTranslation();
  const { openRecordingModal } = useContext(RecordingContext);
  const { memoModal } = useContext(MemoContext);

  const [message, setMessage] = useState(memo.content);
  const [tags, setTags] = useState(memo.tags);
  const [tagRebuild, setTagRebuild] = useState(false);
  const [originImageUrls, setOriginalImageUrls] = useState(memo.image_urls);

  const { handleCreateLinkedMemo } = useCreateMemoManager();
  const { handleUpdateMemo } = useUpdateMemoManager();
  const { handleDeleteMemo } = useDeleteMemoManager();

  const isEditMode = memoModal === null || memoModal.mode === 'edit';

  const {
    images,
    imageUrls: newImageUrls,
    handleImageFilesChange,
    removeImage,
    handlePaste,
    getInputProps,
    getRootProps,
  } = useImageList();

  const imageUrls = useMemo(
    () => [...originImageUrls, ...newImageUrls],
    [originImageUrls, newImageUrls]
  );

  const [audio, setAudio] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(memo.voice_urls[0]);

  useEffect(() => {
    audio && setAudioUrl(URL.createObjectURL(audio));
  }, [audio]);

  const removeImageUrl = useCallback((index: number) => {
    if (index >= originImageUrls.length) {
      removeImage(index - originImageUrls.length);
    } else {
      setOriginalImageUrls((prev) => prev.filter((_, i) => i !== index));
    }
  }, []);

  const handleSubmit = () => {
    if (isEditMode) {
      handlePreProcess();
      handleUpdateMemo({
        memo,
        tagRebuild,
        newContent: message,
        newImages: images,
        newVoice: audio,
        oldImageUrls: originImageUrls,
        oldVoiceUrls: audioUrl ? [audioUrl] : [],
      });
    } else {
      handlePreProcess();
      if (!memoModal.tag) return;

      handleCreateLinkedMemo(
        memoModal.tag,
        message,
        images,
        imageUrls,
        audio,
        audioUrl ? [audioUrl] : []
      );
    }
  };

  const handleMicButtonClick = () => {
    openRecordingModal(audio, setAudio);
  };

  const isSubmitDisabled = useMemo(() => {
    return !message.trim() && imageUrls.length === 0 && !audioUrl;
  }, [message, imageUrls, audioUrl]);

  useEffect(() => {
    setMessage(memo.content);
    setTags(memo.tags);
  }, [memo]);

  return (
    <div
      className={`p-7 flex flex-col h-auto w-full bg-[#FFF6E3] border rounded-md gap-4 
        ${border ? 'border-black border-opacity-10 bg-clip-padding' : 'border-gray1'}`}
    >
      <input {...getInputProps()} />
      <div
        {...getRootProps()}
        className="flex flex-1 flex-col h-full gap-[1.14rem] overflow-hidden"
      >
        <MemoHeader
          tags={tags}
          updatedAt={memo.updated_at}
          dateFormat={t('memo.dateFormat')}
          handleDeleteMemo={() => handleDeleteMemo({ memo, handlePreProcess })}
        />
        <div className="flex flex-col flex-1 overflow-y-scroll no-scrollbar gap-4">
          <ImageMemoText
            key={audioUrl}
            voiceUrl={
              audioUrl
                ? audioUrl
                : memo.voice_urls.length > 0
                  ? memo.voice_urls[0]
                  : null
            }
            imageUrls={imageUrls}
            removeImageUrl={removeImageUrl}
            handleImageFilesChange={handleImageFilesChange}
            message={message}
            metadata={memo.metadata}
            setMessage={setMessage}
            editable
            handlePaste={handlePaste}
          />
        </div>
      </div>
      <EditOptions
        isSubmitDisabled={isSubmitDisabled}
        tagRebuildable={isEditMode}
        tagRebuild={tagRebuild}
        setTagRebuild={setTagRebuild}
        handleMicButtonClick={handleMicButtonClick}
        handleImageFilesChange={handleImageFilesChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditableMemo;
