import { useState, useEffect, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ImageMemoText,
  RecordingControls,
  UneditableTagList,
} from 'pages/home/subPages/components';
import { Memo } from 'pages/home/subPages/interfaces';
import { MemoHeader } from './MemoHeader';
import { useMemoManager } from '../hook';
import { isFilesResponse, uploadFile, uploadFiles } from 'api/index.ts';
import { ImageListContext } from 'utils/index.ts';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { Divider } from '@mui/material';

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

  const parsedMetadata = memo.metadata ? JSON.parse(memo.metadata) : null;
  const voiceDescriptions = parsedMetadata?.voice_record_descriptions || [];

  const { handleUpdateMemo, handleDeleteMemo } = useMemoManager();

  const getProxiedUrl = (url: string) => {
    const originalUrl = new URL(url);
    return `/audio${originalUrl.pathname}`;
  };

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
          updatedAt={memo.updated_at}
          dateFormat={t('memo.dateFormatEdit')}
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
          {memo.voice_urls && memo.voice_urls.length > 0 && (
            <>
              <Divider className="mt-auto" />
              <div className="flex mb-auto flex-col xsm:flex-row w-full flex-1 gap-5 xsm:gap-9 flex-wrap flex-shrink-0">
                <div className="xs:w-60 w-full max-w-72 rounded-2xl overflow-hidden flex-shrink-0">
                  <RecordingControls audioUrl={getProxiedUrl(memo.voice_urls[0])} />
                </div>
                {voiceDescriptions[0] && (
                  <div className="flex flex-1 flex-col w-full text-sm">
                    <p>{voiceDescriptions[0].transcription_summary}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex mr-auto">
          <UneditableTagList
            tags={tags}
            size="large"
            color="peach2"
            border={0}
            invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
          />
        </div>
        <div className="flex ml-auto w-fit gap-6 items-center">
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
