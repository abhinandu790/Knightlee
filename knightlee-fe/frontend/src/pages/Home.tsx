import React from "react"
import { Link } from "react-router-dom"

export default function KnightleeLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#CCF5E9] to-[#E9FFF7] flex flex-col items-center px-6 py-10">
      {/* Logo */}
      <div className="w-24 h-24 bg-[#08a870] rounded-3xl flex items-center justify-center shadow-lg mt-4">
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
      <h1 className="text-5xl font-extrabold text-gray-900 mt-6">Knightlee</h1>

      {/* Subtitle */}
      <p className="text-gray-600 text-center max-w-xl mt-4 text-lg leading-relaxed">
        Your trusted companion for safe navigation and urban safety.
        <br />
        Navigate confidently, arrive safely.
      </p>

      {/* CTA Button → goes to login */}
      <Link to="/login">
        <button className="mt-8 bg-[#009c6a] text-white px-10 py-4 rounded-full shadow-xl text-lg font-semibold hover:bg-[#008458] transition-all">
          Start Safe Navigation
        </button>
      </Link>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-6xl w-full">
        {/* Card 1 */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <div className="w-12 h-12 bg-[#CCF5E9] rounded-xl flex items-center justify-center">
            <ShieldIcon />
          </div>
          <h2 className="text-xl font-semibold mt-4">Safe Routes</h2>
          <p className="text-gray-600 mt-2">
            AI-powered routing that prioritizes your safety over speed.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <div className="w-12 h-12 bg-[#CCF5E9] rounded-xl flex items-center justify-center">
            <ShieldIcon />
          </div>
          <h2 className="text-xl font-semibold mt-4">Danger Alerts</h2>
          <p className="text-gray-600 mt-2">
            Real-time notifications about accident hotspots and incidents.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <div className="w-12 h-12 bg-[#CCF5E9] rounded-xl flex items-center justify-center">
            <ShieldIcon />
          </div>
          <h2 className="text-xl font-semibold mt-4">Emergency SOS</h2>
          <p className="text-gray-600 mt-2">
            Quick access to emergency contacts and live location sharing.
          </p>
        </div>
      </div>
    </div>
  )
}

/* Icon Component */
function ShieldIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="#009c6a"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"
      />
    </svg>
  )
}
