import { SocialLoginButton } from './SocialLoginButton';

const SocialLogins = ({
  kakaoLabel,
  appleLabel,
  googleLabel,
}: {
  kakaoLabel: string;
  appleLabel: string;
  googleLabel: string;
}) => {
  return (
    <div className="flex justify-between mb-2 gap-2">
      <SocialLoginButton
        label={kakaoLabel}
        backgroundColor="#FEE500"
        hoverColor="#FFD700"
        textColor="black"
      />
      <SocialLoginButton
        label={appleLabel}
        backgroundColor="#000000"
        hoverColor="#333333"
        textColor="white"
      />
      <SocialLoginButton
        label={googleLabel}
        backgroundColor="#FFFFFF"
        hoverColor="#F5F5F5"
        textColor="black"
        borderColor="border-gray-300"
      />
    </div>
  );
};

export default SocialLogins;
