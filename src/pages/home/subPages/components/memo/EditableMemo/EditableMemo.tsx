import { useState, useEffect, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageMemoText, TagManager } from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { MemoHeader } from './MemoHeader';
import { TagRebuildCheckbox } from './TagRebuildCheckbox';
import { useMemoManager } from '../hook';
import { isFilesResponse, uploadFile, uploadFiles } from 'api/index.ts';
import { ImageListContext } from 'utils/index.ts';

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

  const [message, setMessage] = useState(memo.content);
  const [tags, setTags] = useState(memo.tags);
  const [imageUrls, setImageUrls] = useState(memo.image_urls);
  const [tagRebuild, setTagRebuild] = useState(false);

  const { handleUpdateMemo, handleDeleteMemo } = useMemoManager();

  const getImageUrls = async (images: File[]): Promise<string[]> => {
    if (images.length === 0) return [];

    const response =
      images.length === 1 ? await uploadFile(images[0]) : await uploadFiles(images);
    if (!isFilesResponse(response))
      throw new Error('파일 업로드에 문제가 생겼습니다.');

    return response.urls;
  };

  const handleUpdateMemoWithUploadImage = async () => {
    try {
      const newImageUrls = await getImageUrls(images);

      handleUpdateMemo({
        memo,
        newMessage: message,
        newTags: tags,
        newImageUrls: [...imageUrls, ...newImageUrls],
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
      className={`p-7 flex flex-col h-auto w-full bg-[#FFF6E3] border rounded-md gap-8 
        ${border ? 'border-black border-opacity-10 bg-clip-padding' : 'border-gray1'}`}
    >
      <div className="flex flex-1 flex-col gap-[1.14rem]">
        <MemoHeader
          updatedAt={memo.updated_at}
          dateFormat={t('memo.dateFormatEdit')}
          handleDeleteMemo={() => handleDeleteMemo({ memo, handlePreProcess })}
        />
        <ImageMemoText
          imageUrls={imageUrls}
          removeImageUrl={removeImageUrl}
          message={message}
          setMessage={setMessage}
          editable
        />
      </div>

      <div className="flex gap-2">
        <TagManager tags={tags} setTags={setTags} editable />
        <div className="flex ml-auto gap-6 items-center">
          <TagRebuildCheckbox
            checked={tagRebuild}
            setChecked={setTagRebuild}
            label={t('memo.tagRebuild')}
          />
          <button
            type="button"
            className="flex h-8 items-center text-brown2 font-medium text-sm px-[27px] py-[3px] 
                rounded-[30px] border border-[#917360]"
            onClick={handleUpdateMemoWithUploadImage}
          >
            {t('memo.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditableMemo;
