import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
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
import { ImageListContext, RecordingContext } from 'utils/index.ts';
import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { Divider } from '@mui/material';
import { CloseIcon } from 'yet-another-react-lightbox';

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
  const { audioBlobs, removeAudio } = useContext(RecordingContext);

  const [message, setMessage] = useState(memo.content);
  const [tags, setTags] = useState(memo.tags);
  const [imageUrls, setImageUrls] = useState(memo.image_urls);
  const [originalAudioUrl, setOriginalAudioUrl] = useState<string | null>(
    memo.voice_urls[0]
  );

  const parsedMetadata = memo.metadata ? JSON.parse(memo.metadata) : null;
  const voiceDescriptions = parsedMetadata?.voice_record_descriptions || [];

  const { handleUpdateMemo, handleDeleteMemo } = useMemoManager();

  const getProxiedUrl = (url: string) => {
    const originalUrl = new URL(url);
    return `/audio${originalUrl.pathname}`;
  };

  const getFileUrls = async (images: File[]): Promise<string[]> => {
    if (images.length === 0) return [];

    const response =
      images.length === 1 ? await uploadFile(images[0]) : await uploadFiles(images);
    if (!isFilesResponse(response))
      throw new Error('파일 업로드에 문제가 생겼습니다.');

    return response.urls;
  };

  const handleUpdateMemoWithUploadImage = async () => {
    try {
      const newImageUrls = await getFileUrls(images);
      const newVoiceUrls = await getFileUrls(
        audioBlobs.map(
          (blob) => new File([blob], 'audio.webm', { type: 'audio/webm' })
        )
      );

      handleUpdateMemo({
        memo,
        newMessage: message,
        newTags: tags,
        newImageUrls: [...imageUrls, ...newImageUrls],
        newVoiceUrls: newVoiceUrls || memo.voice_urls,
        handlePreProcess,
      });
    } catch {
      // FIXME: 에러 처리 어캐 하지...

      alert('메모 수정 실패');
    }
  };

  const handleRemoveAudio = () => {
    if (audioBlobs && audioBlobs.length > 0) {
      originalAudioUrl && URL.revokeObjectURL(originalAudioUrl);
      removeAudio();
    } else if (originalAudioUrl && originalAudioUrl.length > 0) {
      setOriginalAudioUrl(null);
    }
  };

  const removeImageUrl = useCallback((index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const audioUrl = useMemo(() => {
    if (audioBlobs && audioBlobs.length > 0) {
      return URL.createObjectURL(audioBlobs[0]);
    } else if (originalAudioUrl && originalAudioUrl.length > 0) {
      return getProxiedUrl(originalAudioUrl);
    }
    return null;
  }, [audioBlobs, originalAudioUrl]);

  useEffect(() => {
    setMessage(memo.content);
    setTags(memo.tags);
  }, [memo]);

  useEffect(() => {
    return () => {
      removeAudio();
    };
  }, []);

  useEffect(() => {
    const currentUrl = audioUrl;
    return () => {
      if (currentUrl && audioBlobs && audioBlobs.length > 0) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [audioUrl, audioBlobs]);

  return (
    <div
      className={`p-7 flex flex-col h-auto w-full bg-[#FFF6E3] border rounded-md gap-4 
        ${border ? 'border-black border-opacity-10 bg-clip-padding' : 'border-gray1'}`}
    >
      <div className="flex flex-1 flex-col h-full gap-[1.14rem] overflow-hidden">
        <MemoHeader
          haveAudio={memo.voice_urls && memo.voice_urls.length > 0}
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
          {audioUrl && (
            <>
              <Divider className="mt-auto" />
              <div className="flex mb-auto flex-col xsm:flex-row w-full flex-1 gap-5 xsm:gap-9 flex-wrap flex-shrink-0">
                <div className="relative xs:w-60 w-full max-w-72 rounded-2xl overflow-hidden flex-shrink-0">
                  <RecordingControls audioUrl={audioUrl} />
                  <div
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer"
                    onClick={handleRemoveAudio}
                  >
                    <CloseIcon className="w-4 h-4" />
                  </div>
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
