export const UserMessage = ({
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
        <p className="text-lg text-right font-semibold">{name}</p>
        <div className="p-3 inline-block self-end bg-gray0 rounded-lg overflow-hidden max-w-3/4">
          <p className="inline text-right whitespace-pre-line break-words">
            {contentText}
          </p>
        </div>
      </div>
      <img
        src={imageUrl}
        alt="Placeholder"
        className="w-10 h-10 ml-4 object-cover rounded"
      />
    </div>
  );
};
