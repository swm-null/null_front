import { ChangeEvent } from 'react';
import { ImageFileInput } from '../../../../utils';
import { AddIcon } from 'assets/icons';

const AddItem = ({
  handleImageFilesChange,
}: {
  handleImageFilesChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="carousel-cell flex items-center justify-center w-full h-full bg-gray-200 xsm:w-60">
      <ImageFileInput handleImageFileChange={handleImageFilesChange}>
        <AddIcon className="w-10 h-10" />
      </ImageFileInput>
    </div>
  );
};

export default AddItem;
