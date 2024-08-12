interface SocialLoginButtonProps {
  label: string;
  backgroundColor: string;
  hoverColor: string;
  textColor?: string;
  borderColor?: string;
  onClick?: () => void;
}

const SocialLoginButton = ({
  label,
  backgroundColor,
  hoverColor,
  textColor = 'black',
  borderColor,
  onClick,
}: SocialLoginButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg ${textColor ? `text-${textColor}` : ''} ${borderColor ? `border ${borderColor}` : ''}`}
      style={{ backgroundColor: backgroundColor }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
      onMouseOut={(e) =>
        (e.currentTarget.style.backgroundColor = backgroundColor)
      }
    >
      {label}
    </button>
  );
};

export default SocialLoginButton;
