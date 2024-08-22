const UserMessage = ({ contentText }: { contentText: string }) => {
  return (
    <div className="mb-2 flex w-full">
      <div className="flex flex-col flex-1 overflow-clip">
        <div className="inline-block self-end bg-[#F4F4F4] rounded-3xl py-2 px-4 overflow-hidden max-w-3/4">
          <p className="inline text-right whitespace-pre-line break-words">
            {contentText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
