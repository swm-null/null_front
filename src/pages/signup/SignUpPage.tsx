import { useTranslation } from 'react-i18next';

const SignUpPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 py-8">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg overflow-y-auto">
        <div className="mb-6">
          <label
            htmlFor="emailUsername"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            {t('signUp.email')}
          </label>
          <div className="flex items-center">
            <input
              type="text"
              id="emailUsername"
              name="emailUsername"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
            <span className="mx-1">@</span>
            <input
              type="text"
              id="emailDomain"
              name="emailDomain"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            {t('signUp.password')}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="passwordConfirm"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            {t('signUp.passwordConfirm')}
          </label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            {t('signUp.name')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 mb-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-700"
        >
          {t('signUp.signUpButton')}
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
