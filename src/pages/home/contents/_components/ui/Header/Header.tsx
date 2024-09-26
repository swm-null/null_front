const Header = ({ headerText }: { headerText: string }) => {
  return (
    <div className="flex px-4 py-4">
      <p className="font-semibold text-lg">{headerText}</p>
    </div>
  );
};

export default Header;
