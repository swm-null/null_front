export const RightMessage = ({
  name,
  imageUrl,
  contentText,
}: {
  name: string;
  imageUrl: string;
  contentText: string;
}) => {
  return (
    <div className="mb-2 flex w-full">
      <div className="flex flex-col flex-1 overflow-clip">
        <p className="text-base sm:mb-1 text-right font-semibold">{name}</p>
        <div className="px-3 py-2 sm:px-4 sm:py-3 inline-block self-end bg-gray0 rounded-lg overflow-hidden max-w-3/4">
          <p className="text-base inline text-right whitespace-pre-line break-words">
            {contentText}
          </p>
        </div>
      </div>
      <img
        src={imageUrl}
        alt="Placeholder"
        className="w-9 h-9 ml-3 sm:ml-4 object-cover rounded"
      />
    </div>
  );
};
