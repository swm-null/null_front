import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

interface PageDotsProps {
  allImages: string[];
  photoIndex: number;
  setPhotoIndex: (index: number) => void;
  editable?: boolean;
}

const PageDots = ({
  allImages,
  photoIndex,
  setPhotoIndex,
  editable,
}: PageDotsProps) => {
  return (
    <div className="flex gap-1 justify-center mt-2 h-4">
      {Array.from({ length: allImages.length }).map((_, index) => (
        <button
          type="button"
          className="p-1"
          key={`dot-${index}`}
          onClick={() => setPhotoIndex(index)}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full p-1 self-center ${
              index === photoIndex ? 'bg-black' : 'bg-gray1'
            }`}
          />
        </button>
      ))}
      {editable && (
        <AddOutlinedIcon
          sx={{ width: 16, height: 16, padding: 0, margin: 0 }}
          className={`cursor-pointer ${
            photoIndex === allImages.length ? 'text-black' : 'text-gray1'
          }`}
          onClick={() => setPhotoIndex(allImages.length)}
        />
      )}
    </div>
  );
};

export default PageDots;
