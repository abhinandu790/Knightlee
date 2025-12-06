import { useState } from "react";
import { AlertOctagon, BellIcon, PhoneCallIcon, ShieldAlert } from "lucide-react";
import ReportIncidentModal from "../components/ReportIncidentModal";

export default function Home() {
  const [showReportModal, setShowReportModal] = useState(false);

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

      {/* CTA Button → Map */}
      <a href="/mapscreen">
        <button className="mt-8 bg-[#009c6a] text-white px-10 py-4 rounded-full shadow-xl text-lg font-semibold hover:bg-[#008458] transition-all">
          Start Safe Navigation
        </button>
      </a>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-6xl w-full">

        {/* 1. Helpline → navigates to HelplinePage */}
        <a
          href="/helpline"
          className="bg-white rounded-3xl shadow-md p-6 hover:shadow-lg transition block cursor-pointer"
        >
          <div className="w-12 h-12 bg-[#d1fae5] rounded-xl flex items-center justify-center">
            <PhoneCallIcon className="w-6 h-6 text-[#0f9d58]" />
          </div>
          <h2 className="text-xl font-semibold mt-4">Helpline</h2>
          <p className="text-gray-600 mt-2">
            Connect with trusted emergency responders.
          </p>
        </a>

        {/* 2. Safe Points → now navigates to SafePointsPage */}
        <a
          href="/safepoints"
          className="bg-white rounded-3xl shadow-md p-6 hover:shadow-lg transition block cursor-pointer"
        >
          <div className="w-12 h-12 bg-[#e0f2fe] rounded-xl flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-[#0284c7]" />
          </div>
          <h2 className="text-xl font-semibold mt-4">Safe Points</h2>
          <p className="text-gray-600 mt-2">
            Find the safest places near you.
          </p>
        </a>

        {/* 3. Emergency SOS → navigates to SOS page */}
        <a
          href="/sos"
          className="bg-white rounded-3xl shadow-md p-6 hover:shadow-lg transition block cursor-pointer"
        >
          <div className="w-12 h-12 bg-[#fee2e2] rounded-xl flex items-center justify-center">
            <BellIcon className="w-6 h-6 text-[#dc2626]" />
          </div>
          <h2 className="text-xl font-semibold mt-4">Emergency SOS</h2>
          <p className="text-gray-600 mt-2">
            Triggers an SOS and shares your location.
          </p>
        </a>

        {/* 4. Report Incident → opens modal */}
        <button
          onClick={() => setShowReportModal(true)}
          className="bg-white rounded-3xl shadow-md p-6 text-left hover:shadow-lg transition cursor-pointer"
        >
          <div className="w-12 h-12 bg-[#fff7e6] rounded-xl flex items-center justify-center">
            <AlertOctagon className="w-6 h-6 text-[#ea580c]" />
          </div>
          <h2 className="text-xl font-semibold mt-4">Report Incident</h2>
          <p className="text-gray-600 mt-2">
            Report harassment, theft, or unsafe spots around you.
          </p>
        </button>

      </div>

      {/* Report Incident Modal */}
      {showReportModal && (
        <ReportIncidentModal onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
}
