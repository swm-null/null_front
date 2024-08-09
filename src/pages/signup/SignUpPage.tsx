import { FormControl, FormLabel, TextField, Button } from '@mui/material';

const SignUpPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 py-8">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg overflow-y-auto">
        <div className="mb-6">
          <FormControl fullWidth>
            <FormLabel
              htmlFor="id"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              아이디
            </FormLabel>
            <div className="flex items-center">
              <TextField
                type="text"
                id="id"
                name="id"
                variant="outlined"
                fullWidth
              />
              <span className="mx-1">@</span>
              <TextField
                type="text"
                id="id"
                name="id"
                variant="outlined"
                fullWidth
              />
            </div>
          </FormControl>
        </div>
        <div className="mb-6">
          <FormControl fullWidth>
            <FormLabel
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </FormLabel>
            <TextField
              type="password"
              id="password"
              name="password"
              variant="outlined"
              fullWidth
            />
          </FormControl>
        </div>
        <div className="mb-6">
          <FormControl fullWidth>
            <FormLabel
              htmlFor="passwordConfirm"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password 확인
            </FormLabel>
            <TextField
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              variant="outlined"
              fullWidth
            />
          </FormControl>
        </div>
        <div className="mb-6">
          <FormControl fullWidth>
            <FormLabel
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              이름
            </FormLabel>
            <TextField
              type="text"
              id="name"
              name="name"
              variant="outlined"
              fullWidth
            />
          </FormControl>
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="py-2 mb-4"
        >
          회원가입
        </Button>
      </form>
    </div>
  );
};

export default SignUpPage;
