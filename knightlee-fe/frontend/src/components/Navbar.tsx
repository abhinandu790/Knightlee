import React from "react"
import { Link, useLocation } from "react-router-dom"

export default function Navbar() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#08a870] rounded-2xl flex items-center justify-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="white"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"
              />
            </svg>
          </div>
          <span className="text-2xl font-extrabold text-gray-900">Knightlee</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link
            to="/login"
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              isActive("/login")
                ? "bg-[#009c6a] text-white"
                : "text-gray-700 hover:text-[#009c6a]"
            }`}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              isActive("/signup")
                ? "bg-[#009c6a] text-white"
                : "text-gray-700 hover:text-[#009c6a]"
            }`}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )
}
