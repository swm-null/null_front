import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { TextareaAutosize } from '@mui/material';
import { usePressEnterFetch } from 'pages/home/subPages/hooks';
import { IconButtons } from './IconButtons';
import { HiddenTextarea } from './HiddenTextarea';
import { ImageList } from './ImageList';
import { ImageListContext } from 'utils';
import { isFilesResponse, uploadFile, uploadFiles } from 'api';

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
  const { images, addImage, removeImage, removeAllImage } =
    useContext(ImageListContext);
  const [focus, setFocus] = useState(false);
  const [isMultiline, setIsMultiline] = useState(false);
  const [hiddenTextareaWidth, setHiddenTextareaWidth] = useState<number | null>(
    null
  );

  const hiddenTextareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      images.length === 1
        ? await uploadFile(images[0])
        : await uploadFiles(images);
    if (!isFilesResponse(response))
      throw new Error('파일 업로드에 문제가 생겼습니다.');

    return response.urls;
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.relatedTarget)
    ) {
      setFocus(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    Array.from(items).forEach((item) => {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        if (blob) addImage(blob);
      }
    });
  };

  const handleMicButtonClick = () => {
    // TODO: 마이크 버튼 클릭시 하는 메소드 생기면 추가
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      addImage(files[0]);
    }
  };

  const handleCameraButtonClick = () => {
    const inputFile = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (inputFile) inputFile.click();
  };

  useEffect(() => {
    if (hiddenTextareaRef.current && containerRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(hiddenTextareaRef.current).lineHeight
      );
      const maxLines = Math.floor(
        hiddenTextareaRef.current.clientHeight / lineHeight
      );
      setIsMultiline(maxLines > 1 || images.length >= 1);
      setHiddenTextareaWidth(containerRef.current.clientWidth);
    }
  }, [value, images]);

  return (
    <div
      className="flex flex-shrink-0 px-4 py-3 rounded-2xl overflow-hidden gap-4 bg-[#FFF6E3CC] border border-black border-opacity-10 font-regular shadow-custom backdrop-blur-lg"
      onFocus={() => setFocus(true)}
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
          onCameraButtonClick={handleCameraButtonClick}
          onFileChange={handleFileChange}
          onSubmitButtonClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default MemoCreateTextArea;
