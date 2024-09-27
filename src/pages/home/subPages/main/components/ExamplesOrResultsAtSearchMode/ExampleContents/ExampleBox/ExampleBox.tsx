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
      className="flex flex-col items-start px-5 py-6 rounded-2xl min-h-24 cursor-pointer
        bg-[#FFF6E3CC] border-[1px] border-[#E3BFA5] shadow-custom"
      onClick={onClick}
    >
      <Icon className="mb-2" />
      <p>{exampleText}</p>
    </div>
  );
};

export default ExampleBox;