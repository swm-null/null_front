import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO: 로그인 로직 추가
    navigate('/home');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 py-8">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="flex justify-between mb-2 gap-2">
          <button
            type="button"
            className="flex-1 py-2 text-black bg-yellow-400 rounded-lg hover:bg-yellow-500"
          >
            카카오톡
          </button>
          <button
            type="button"
            className="flex-1 py-2 text-white bg-black rounded-lg hover:bg-gray-800"
          >
            애플 아이디
          </button>
          <button
            type="button"
            className="flex-1 py-2 text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            구글
          </button>
        </div>
        <button
          type="button"
          onClick={handleLogin}
          className="w-full py-2 mb-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-700"
        >
          Login
        </button>
        <button
          type="button"
          onClick={handleSignUp}
          className="w-full py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:bg-gray-400"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
