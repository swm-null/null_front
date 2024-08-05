const UserMessage = ({ contentText }: { contentText: string }) => {
  return (
    <div className="mb-2 flex w-full">
      <div className="flex flex-col flex-1 overflow-clip">
        <div className="p-3 inline-block self-end bg-gray0 rounded-lg overflow-hidden max-w-3/4">
          <p className="inline text-right whitespace-pre-line break-words">
            {contentText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
