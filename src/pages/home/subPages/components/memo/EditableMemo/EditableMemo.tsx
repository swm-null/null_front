import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageMemoText } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { MemoHeader } from './MemoHeader';
import { useMemoManager } from '../hook';
import { isFilesResponse, uploadFile, uploadFiles } from 'api';
import { AlertContext, RecordingContext } from 'utils';
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
  const { alert } = useContext(AlertContext);
  const { openRecordingModal } = useContext(RecordingContext);

  const [message, setMessage] = useState(memo.content);
  const [tags, setTags] = useState(memo.tags);
  const [tagRebuild, setTagRebuild] = useState(false);
  const [originImageUrls, setOriginalImageUrls] = useState(memo.image_urls);

  const { handleUpdateMemo, handleUpdateMemoWithRecreateTags, handleDeleteMemo } =
    useMemoManager();

  const isEditMode = mode === 'edit';

  const {
    images,
    imageUrls: newImageUrls,
    handleImageFilesChange,
    removeImage,
  } = useImageList();

  const [audio, setAudio] = useState<File | null>(null);
  const audioUrl = useMemo(() => {
    console.log(audio ? URL.createObjectURL(audio) : 'no audio');
    return audio ? URL.createObjectURL(audio) : null;
  }, [audio]);

  const imageUrls = useMemo(
    () => [...originImageUrls, ...newImageUrls],
    [originImageUrls, newImageUrls]
  );

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
      const newVoiceUrls = await getFileUrls(audio ? [audio] : []);

      if (tagRebuild) {
        handleUpdateMemoWithRecreateTags({
          memo,
          newMessage: message,
          newTags: tags,
          newImageUrls: [...originImageUrls, ...newImageUrls],
          newVoiceUrls: newVoiceUrls.length > 0 ? newVoiceUrls : memo.voice_urls,
          handlePreProcess,
        });
      } else {
        handleUpdateMemo({
          memo,
          newMessage: message,
          newTags: tags,
          newImageUrls: [...originImageUrls, ...newImageUrls],
          newVoiceUrls: newVoiceUrls.length > 0 ? newVoiceUrls : memo.voice_urls,
          handlePreProcess,
        });
      }
    } catch {
      // FIXME: 에러 처리 어캐 하지...

      alert('메모 수정 실패');
    }
  };

  const removeImageUrl = useCallback((index: number) => {
    if (index >= originImageUrls.length) {
      removeImage(index - originImageUrls.length);
    } else {
      setOriginalImageUrls((prev) => prev.filter((_, i) => i !== index));
    }
  }, []);

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
        handleUpdateMemoWithUploadFiles={handleUpdateMemoWithUploadFiles}
      />
    </div>
  );
};

export default EditableMemo;
