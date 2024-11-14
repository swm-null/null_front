import { useState, useEffect, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageMemoText } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { MemoHeader } from './MemoHeader';
import { useMemoManager } from '../hook';
import { isFilesResponse, uploadFile, uploadFiles } from 'api';
import { AlertContext, ImageListContext } from 'utils';
import { EditOptions } from './EditOptions';

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
  const { images } = useContext(ImageListContext);
  const { alert } = useContext(AlertContext);

  const [message, setMessage] = useState(memo.content);
  const [tags, setTags] = useState(memo.tags);
  const [imageUrls, setImageUrls] = useState(memo.image_urls);

  const { handleUpdateMemo, handleDeleteMemo } = useMemoManager();

  const { handleImageFilesChange, handleAddImageButtonClick } =
    useContext(ImageListContext);

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
        newTags: tags,
        newImageUrls: [...imageUrls, ...newImageUrls],
        newVoiceUrls: memo.voice_urls,
        handlePreProcess,
      });
    } catch {
      // FIXME: 에러 처리 어캐 하지...

      alert('메모 수정 실패');
    }
  };

  const removeImageUrl = useCallback((index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }, []);

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
            imageUrls={imageUrls}
            removeImageUrl={removeImageUrl}
            message={message}
            setMessage={setMessage}
            editable
          />
        </div>
      </div>
      <EditOptions
        handleImageFilesChange={handleImageFilesChange}
        handleAddImageButtonClick={handleAddImageButtonClick}
        handleUpdateMemoWithUploadFiles={handleUpdateMemoWithUploadFiles}
      />
    </div>
  );
};

export default EditableMemo;
