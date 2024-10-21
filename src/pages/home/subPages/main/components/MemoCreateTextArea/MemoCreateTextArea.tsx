import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { TextareaAutosize } from '@mui/material';
import { usePressEnterFetch } from 'pages/home/subPages/hooks';
import { IconButtons } from './IconButtons';
import { HiddenTextarea } from './HiddenTextarea';
import { ImageList } from './ImageList';
import { ImageListContext } from 'utils';
import { isFilesResponse, uploadFile, uploadFiles } from 'api';
import { useHiddenTextareaManager } from './hook';

interface MemoCreateTextAreaProps {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (images: string[]) => void;
}

const MemoCreateTextArea = ({
  value,
  placeholder,
  onChange,
  onSubmit,
}: MemoCreateTextAreaProps) => {
  const { images, addImage, removeImage, removeAllImage, isValidFileType } =
    useContext(ImageListContext);
  const [focus, setFocus] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hiddenTextareaWidth, setHiddenTextareaWidth] = useState<number | null>(
    null
  );

  const { hiddenTextareaRef, isMultiline } = useHiddenTextareaManager(value, images);
  const { handlePressEnterFetch } = usePressEnterFetch({
    handleEnterWithCtrl: handleSubmit,
  });

  async function handleSubmit() {
    setFocus(false);
    const imageUrls = await getImageUrls(images);
    onSubmit(imageUrls);
    removeAllImage();
  }

  const getImageUrls = async (images: File[]): Promise<string[]> => {
    if (images.length === 0) return [];

    const response =
      images.length === 1 ? await uploadFile(images[0]) : await uploadFiles(images);
    if (!isFilesResponse(response))
      throw new Error('파일 업로드에 문제가 생겼습니다.');

    return response.urls;
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget)) {
      setFocus(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    Array.from(items).forEach((item) => {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        if (blob && isValidFileType(blob)) addImage(blob);
      }
    });
  };

  const handleMicButtonClick = () => {
    // TODO: 마이크 버튼 클릭시 하는 메소드 생기면 추가
  };

  useEffect(() => {
    if (containerRef.current) {
      setHiddenTextareaWidth(containerRef.current?.clientWidth);
    }
  }, [containerRef.current]);

  return (
    <div className="p-4">
      <div
        className="flex flex-shrink-0 px-4 py-3 rounded-2xl overflow-hidden gap-4 bg-[#FFF6E3CC] border border-black border-opacity-10 font-regular shadow-custom backdrop-blur-lg"
        onBlur={handleBlur}
        onPaste={handlePaste}
      >
        <HiddenTextarea
          value={value}
          hiddenTextareaWidth={hiddenTextareaWidth}
          hiddenTextareaRef={hiddenTextareaRef}
        />
        <div
          ref={containerRef}
          className={`flex flex-1 ${isMultiline ? 'flex-col' : 'flex-row'}`}
        >
          <TextareaAutosize
            className="flex-auto focus:outline-none resize-none min-h-9 content-center
            text-[#111111] bg-transparent placeholder-custom"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onKeyDown={handlePressEnterFetch}
            minRows={1}
            maxRows={20}
          />
          <ImageList images={images} removeImage={removeImage} />
          <IconButtons
            submitAvailable={focus || isMultiline}
            onMicButtonClick={handleMicButtonClick}
            onSubmitButtonClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default MemoCreateTextArea;
