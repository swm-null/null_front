const ExampleBox = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex items-center justify-center px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200 min-h-24 cursor-pointer"
      onClick={onClick}
      style={{ width: '100%', boxSizing: 'border-box' }}
    >
      {text}
    </div>
  );
};

export default ExampleBox;
