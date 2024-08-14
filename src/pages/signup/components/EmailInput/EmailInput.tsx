import { useState } from 'react';

interface EmailInputProps {
  value: {
    username: string;
    domain: string;
  };
  onChange: (newValue: { username: string; domain: string }) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ value, onChange }) => {
  const [emailUsername, setEmailUsername] = useState(value.username || '');
  const [emailDomain, setEmailDomain] = useState(value.domain || '');

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setEmailUsername(newUsername);
    onChange({ username: newUsername, domain: emailDomain });
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDomain = e.target.value;
    setEmailDomain(newDomain);
    onChange({ username: emailUsername, domain: newDomain });
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        id="emailUsername"
        name="emailUsername"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        value={emailUsername}
        onChange={handleUsernameChange}
      />
      <span className="mx-1">@</span>
      <input
        type="text"
        id="emailDomain"
        name="emailDomain"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        value={emailDomain}
        onChange={handleDomainChange}
      />
    </div>
  );
};

export default EmailInput;
