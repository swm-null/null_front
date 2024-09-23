import { ElementType } from 'react';

const ExampleBox = ({
  exampleText,
  icon: Icon,
  onClick,
}: {
  exampleText: string;
  icon: ElementType;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex flex-col items-start px-5 py-6 bg-[#FFF6E3CC] rounded-lg shadow-md border border-gray-200 min-h-24 cursor-pointer"
      onClick={onClick}
    >
      <Icon className="mb-2" />
      <p>{exampleText}</p>
    </div>
  );
};

export default ExampleBox;
