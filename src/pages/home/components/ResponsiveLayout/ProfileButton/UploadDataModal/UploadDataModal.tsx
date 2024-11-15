import { Modal } from '@mui/material';
import { useClickWithoutDrag } from 'pages/hooks';
import { UploadData } from './UploadData';

interface UploadDataModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

const UploadDataModal = ({ isOpen, handleClose }: UploadDataModalProps) => {
  const { handleMouseDown, handleMouseMove, handleClick } =
    useClickWithoutDrag(handleClose);

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <div
          className="relative p-7 flex flex-col h-auto w-full bg-[#FFF6E3] border rounded-2xl gap-4 max-w-[600px] min-h-[400px] shadow-custom 
            border-black border-opacity-10 bg-clip-padding"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="ml-auto text-gray-500 hover:text-gray-800"
            onClick={handleClose}
          >
            ✕
          </button>
          <div className="flex flex-1 flex-col h-full gap-[1.14rem] overflow-hidden">
            <div className="flex flex-col flex-1 overflow-y-scroll no-scrollbar gap-4">
              <UploadData handleProProcess={handleClose} />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UploadDataModal;
