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
    <div className="flex gap-1 justify-center mt-2 h-4 xs:w-60 w-full max-w-72">
      {Array.from({ length: allImages.length }).map((_, index) => (
        <button
          type="button"
          className="p-1"
          key={`dot-${index}`}
          onClick={() => setPhotoIndex(index)}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full p-1 self-center ${
              index === photoIndex ? 'bg-brown2' : 'bg-[#E6DDCF]'
            }`}
          />
        </button>
      ))}
      {editable && (
        <AddOutlinedIcon
          sx={{ width: 16, height: 16, padding: 0, margin: 0 }}
          className={`cursor-pointer ${
            photoIndex === allImages.length ? 'text-brown2' : 'text-[#CCC5BA]'
          }`}
          onClick={() => setPhotoIndex(allImages.length)}
        />
      )}
    </div>
  );
};

export default PageDots;
