import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'assets/icons';

const CustomInput = ({
  label,
  value,
  setValue,
  hidden = false,
  useHiddenToggle = false,
  errorMessage = '',
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  hidden?: boolean;
  useHiddenToggle?: boolean;
  errorMessage?: string;
}) => {
  const [isHidden, setIsHidden] = useState(hidden);

  const toggleHidden = () => {
    setIsHidden((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      <p className="block mb-2 text-sm font-medium text-gray-700">{label}</p>
      <div
        className="flex items-center w-full bg-white border 
        border-black border-opacity-10 bg-clip-padding rounded-lg py-2 px-2"
      >
        <input
          type={isHidden ? 'password' : 'text'}
          id={label}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 w-full focus:outline-none focus:ring focus:border-blue-300"
        />
        {useHiddenToggle &&
          (isHidden ? (
            <EyeIcon
              className="text-brown2"
              width={25}
              height={25}
              onClick={toggleHidden}
            />
          ) : (
            <EyeOffIcon
              className="text-brown2"
              width={25}
              height={25}
              onClick={toggleHidden}
            />
          ))}
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default CustomInput;
