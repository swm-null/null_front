const Header = ({ headerText }: { headerText: string }) => {
  return (
    <div className="flex py-[1.19rem]">
      <p className="font-bold text-2xl text-[#6A5344E6]">{headerText}</p>
    </div>
  );
};

export default Header;
