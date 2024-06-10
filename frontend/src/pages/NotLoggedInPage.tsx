import { Link } from "react-router-dom";

const NotLoggedInPage = () => {
  return (
    <div className="max-w-lg mx-auto p-24 mt-24">
      <h4 className="text-xl font-semibold mb-6">
        Welcome to CodeLens! You are not permitted to view our problems until
        you have logged in.
      </h4>
      <div className="flex flex-col space-y-4">
        <Link
          to="/login"
          className="w-full p-3 bg-blue-500 text-center text-white rounded hover:bg-blue-700"
        >
          Log in
        </Link>
        <Link
          to="/register"
          className="w-full p-3 bg-gray-200 text-center text-gray-800 rounded border border-gray-300 hover:bg-gray-300"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default NotLoggedInPage;
