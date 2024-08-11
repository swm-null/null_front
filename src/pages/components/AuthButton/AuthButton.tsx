interface AuthButtonProps {
  label: string;
  onClick: () => void;
  bgColor: string;
  hoverColor: string;
  textColor?: string;
  additionalClasses?: string;
}

const AuthButton = ({
  label,
  onClick,
  bgColor,
  hoverColor,
  textColor = 'white',
  additionalClasses = '',
}: AuthButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full py-2 rounded-lg focus:outline-none ${additionalClasses}`}
      style={{ backgroundColor: bgColor, color: textColor }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
    >
      {label}
    </button>
  );
};

export default AuthButton;
