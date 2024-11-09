import { ChangeEvent, useContext, useState } from 'react';
import { LightSearchIcon } from 'assets/icons';
import { BottomNavContext } from 'utils';

interface MemoSearchTextAreaProps {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent) => void;
  onSubmit: () => void;
}

const MemoSearchTextArea = ({
  value,
  placeholder,
  onChange,
  onSubmit,
}: MemoSearchTextAreaProps) => {
  const { isSmallScreen } = useContext(BottomNavContext);

  const [focus, setFocus] = useState(false);
  const getBackgroundColor = () => (focus ? 'bg-[#FFF6E3]' : 'bg-[#FFF6E3CC]');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="p-4">
      <div
        className={`flex flex-shrink-0 px-4 py-3 rounded-2xl overflow-hidden gap-4 h-[62px] items-center
          ${getBackgroundColor()} border-[1px] border-[#E3BFA4] font-regular shadow-custom`}
      >
        <form className="flex flex-1 gap-2 h-fit" onSubmit={handleSubmit}>
          <LightSearchIcon
            className={`self-center text-brown1 ${isSmallScreen ? 'w-[1.125rem] h-[1.125rem]' : 'w-[1.375rem] h-[1.375rem]'}`}
          />
          <input
            className="flex flex-1 flex-shrink-0 focus:outline-none resize-none content-center h-full
            text-[#111111] bg-transparent placeholder-custom self-center"
            value={value}
            onChange={onChange}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholder={placeholder}
          />
        </form>
      </div>
    </div>
  );
};

export default MemoSearchTextArea;
