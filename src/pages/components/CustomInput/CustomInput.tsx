import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'assets/icons';

const CustomInput = ({
  label,
  value,
  setValue,
  hidden = false,
  useHiddenToggle = false,
  editable = true,
  disabled = false,
  autoComplete = 'off',
  error,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  hidden?: boolean;
  useHiddenToggle?: boolean;
  editable?: boolean;
  disabled?: boolean;
  autoComplete?: 'username' | 'email' | 'off';
  error?: { flag: boolean; message: string };
}) => {
  const [isHidden, setIsHidden] = useState(hidden);

  const toggleHidden = () => {
    setIsHidden((prev) => !prev);
  };

  return (
    <div className="flex flex-col relative w-full gap-2">
      <p className="block text-sm font-medium text-gray-700">{label}</p>
      <div
        className={`flex items-center w-full border 
          border-black border-opacity-10 bg-clip-padding rounded-lg py-2 px-2
          ${disabled ? 'bg-black bg-opacity-10' : 'bg-white'}`}
      >
        <input
          type={isHidden ? 'password' : 'text'}
          id={label}
          value={value}
          readOnly={!editable}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 w-full focus:outline-none bg-transparent"
          autoComplete={isHidden ? 'current-password' : autoComplete}
        />
        {useHiddenToggle &&
          (isHidden ? (
            <EyeOffIcon
              className="text-brown2"
              width={25}
              height={25}
              onClick={toggleHidden}
            />
          ) : (
            <EyeIcon
              className="text-brown2"
              width={25}
              height={25}
              onClick={toggleHidden}
            />
          ))}
      </div>
      {error?.flag && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};

export default CustomInput;
