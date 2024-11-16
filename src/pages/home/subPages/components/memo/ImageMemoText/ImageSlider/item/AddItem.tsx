import { ChangeEvent, RefObject } from 'react';
import { ImageFileInput } from 'pages/home/subPages/components/utils';
import { AddIcon } from 'assets/icons';

const AddItem = ({
  addImageInputRef,
  handleImageFilesChange,
}: {
  addImageInputRef: RefObject<HTMLInputElement>;
  handleImageFilesChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <ImageFileInput
      ref={addImageInputRef}
      className="h-full w-full"
      onFileChange={handleImageFilesChange}
    >
      <div className="carousel-cell flex items-center justify-center w-full h-full bg-[#E6DDCF] xsm:w-60">
        <AddIcon className="w-10 h-10 text-brown2" />
      </div>
    </ImageFileInput>
  );
};

export default AddItem;
