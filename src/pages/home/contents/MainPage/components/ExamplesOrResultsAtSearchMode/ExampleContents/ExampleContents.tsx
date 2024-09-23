import { ExampleBox } from './ExampleBox';
import { ExIcon1, ExIcon2, ExIcon3, ExIcon4 } from 'assets/icons';

const ExampleContent = ({
  buttonData,
  handleButtonClick,
}: {
  buttonData: [string, string, string, string];
  handleButtonClick: (message: string) => void;
}) => {
  const icons = [ExIcon1, ExIcon2, ExIcon3, ExIcon4];

  return (
    <div className="flex justify-center items-center mt-4 font-medium overflow-visible">
      <div
        className="grid w-full gap-4 overflow-visible"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
        }}
      >
        {buttonData.map((text, index) => (
          <ExampleBox
            key={index}
            exampleText={text}
            icon={icons[index]}
            onClick={() => handleButtonClick(text)}
          />
        ))}
      </div>
    </div>
  );
};

export default ExampleContent;
