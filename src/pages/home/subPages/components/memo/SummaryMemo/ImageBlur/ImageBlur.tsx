const ImageBlur = () => (
  <div
    className="absolute inset-0
      bg-[rgba(38,38,38,0.45)] 
      backdrop-blur-[1.5px] rounded-2xl overflow-hidden"
    style={{
      strokeWidth: '1px',
      stroke: 'rgba(0, 0, 0, 0.8)',
    }}
  />
);

export default ImageBlur;
