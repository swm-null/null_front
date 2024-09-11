import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ExampleBox } from './ExampleBox';

const ExampleContent = ({
  buttonData,
  handleButtonClick,
}: {
  buttonData: string[];
  handleButtonClick: (message: string) => void;
}) => (
  <div className="flex justify-center items-center mt-4">
    <ResponsiveMasonry
      columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 4 }}
      className="w-full"
    >
      <Masonry gutter="10px">
        {buttonData.map((text, index) => (
          <ExampleBox
            key={index}
            text={text}
            onClick={() => handleButtonClick(text)}
          />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  </div>
);

export default ExampleContent;
