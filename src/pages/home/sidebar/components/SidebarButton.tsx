interface SideBarButtonProps {
  icon: JSX.Element;
  label: string;
  onClick: () => void;
}

const SideBarButton = ({ icon, label, onClick }: SideBarButtonProps) => {
  return (
    <button
      className="flex items-center p-2 w-full text-left rounded"
      onClick={onClick}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
};

export default SideBarButton;
