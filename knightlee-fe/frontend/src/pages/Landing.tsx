import { Link } from "react-router-dom";

export default function HomeLanding() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to KnightLee
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Choose an option to get started
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          {/* Login */}
          <Link to="/login">
            <button
              type="button"
              className="px-8 py-3 bg-[#10B981] text-white rounded-lg font-medium hover:bg-[#059669] transition-colors"
            >
              Login
            </button>
          </Link>

          {/* Sign Up */}
          <Link to="/signup">
            <button
              type="button"
              className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Sign Up
            </button>
          </Link>

        </div>
      </div>
    </div>
  );
}
