import { Link } from "react-router-dom";

export default function HomeLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E9FFF7] to-[#CCF5E9] flex items-center justify-center px-4">
      <div className="text-center">

        {/* Logo */}
        <div className="w-24 h-24 bg-[#08a870] rounded-3xl flex items-center justify-center shadow-lg mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="white"
            className="w-12 h-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to KnightLee
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-8">
          Choose an option to get started
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <Link to="/login">
            <button
              type="button"
              className="px-8 py-3 bg-[#10B981] text-white rounded-lg font-medium hover:bg-[#059669] transition-colors"
            >
              Login
            </button>
          </Link>

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
