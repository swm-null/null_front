import { ChangeEvent, useState } from 'react';

interface EmailInputProps {
  value: {
    emailId: string;
    domain: string;
  };
  onChange: (newValue: { emailId: string; domain: string }) => void;
}

const EmailInput = ({ value, onChange }: EmailInputProps) => {
  const [emailId, setEmailId] = useState(value.emailId || '');
  const [emailDomain, setEmailDomain] = useState(value.domain || '');

  const handleEmailIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEmailId = e.target.value;
    setEmailId(newEmailId);
    onChange({ emailId: newEmailId, domain: emailDomain });
  };

  const handleDomainChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDomain = e.target.value;
    setEmailDomain(newDomain);
    onChange({ emailId: emailId, domain: newDomain });
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        id="emailUsername"
        name="emailUsername"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        value={emailId}
        onChange={handleEmailIdChange}
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
