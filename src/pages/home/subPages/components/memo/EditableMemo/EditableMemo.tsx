import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageMemoText } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { MemoHeader } from './MemoHeader';
import { useMemoManager } from '../hook';
import { RecordingContext } from 'utils';
import { EditOptions } from './EditOptions';
import { useImageList } from 'pages/home/subPages/hooks';

const EditableMemo = ({
  memo,
  border,
  handlePreProcess,
  mode = 'edit',
}: {
  memo: Memo;
  border?: boolean;
  mode?: 'create' | 'edit';
  handlePreProcess: () => void;
}) => {
  const { t } = useTranslation();
  const { openRecordingModal } = useContext(RecordingContext);

  const [message, setMessage] = useState(memo.content);
  const [tags, setTags] = useState(memo.tags);
  const [tagRebuild, setTagRebuild] = useState(false);
  const [originImageUrls, setOriginalImageUrls] = useState(memo.image_urls);

  const { handleUpdateMemoWithUploadFiles, handleDeleteMemo } = useMemoManager();

  const isEditMode = mode === 'edit';

  const {
    images,
    imageUrls: newImageUrls,
    handleImageFilesChange,
    removeImage,
  } = useImageList();

  const [audio, setAudio] = useState<File | null>(null);
  const audioUrl = useMemo(() => {
    return audio ? URL.createObjectURL(audio) : null;
  }, [audio]);

  const imageUrls = useMemo(
    () => [...originImageUrls, ...newImageUrls],
    [originImageUrls, newImageUrls]
  );

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
      handleUpdateMemoWithUploadFiles({
        memo,
        tagRebuild,
        newContent: message,
        newImages: images,
        originImageUrls,
        newVoice: audio,
        originalVoiceUrl: audioUrl,
      });
    } else {
      handlePreProcess();
      // 해당 태그에 메모 추가하는 코드 넣기
    }
  };

  const handleMicButtonClick = () => {
    openRecordingModal(audio, setAudio);
  };

  useEffect(() => {
    setMessage(memo.content);
    setTags(memo.tags);
  }, [memo]);

  return (
    <div
      className={`p-7 flex flex-col h-auto w-full bg-[#FFF6E3] border rounded-md gap-4 
        ${border ? 'border-black border-opacity-10 bg-clip-padding' : 'border-gray1'}`}
    >
      <div className="flex flex-1 flex-col h-full gap-[1.14rem] overflow-hidden">
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
          />
        </div>
      </div>
      <EditOptions
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
