import { MouseEvent } from 'react';

interface ModeToggleProps {
  mode: 'create' | 'search';
  onModeChange: (
    event: MouseEvent<HTMLButtonElement>,
    newMode: 'create' | 'search'
  ) => void;
}

const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  return (
    <div className="flex space-x-2 my-4">
      <button
        onClick={(event) => onModeChange(event, 'search')}
        className={`rounded-full inline-flex items-center py-2 px-4 cursor-pointer focus:outline-none 
          ${mode === 'search' ? 'bg-[#E8E2FF] text-[#7C58FE]' : 'bg-transparent text-black'} `}
      >
        검색
      </button>
      <button
        onClick={(event) => onModeChange(event, 'create')}
        className={`rounded-full inline-flex items-center py-2 px-4 cursor-pointer focus:outline-none 
          ${mode === 'create' ? 'bg-[#E8E2FF] text-[#7C58FE]' : 'bg-transparent text-black'} `}
      >
        추가
      </button>
    </div>
  );
};

export default ModeToggle;
