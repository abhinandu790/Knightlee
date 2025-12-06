import Navbar from "../components/Navbar";

export default function SOSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE5E5] to-[#FFF5F5]">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-10 text-center">
        <h1 className="text-3xl font-extrabold text-red-600 mb-2">
          Emergency SOS
        </h1>
        <p className="text-gray-700 mb-6">
          In emergencies, share your live location and alert trusted contacts instantly.
        </p>

        {/* Live location placeholder UI */}
        <div className="bg-white rounded-3xl shadow-md p-6 mb-10">
          <h2 className="text-lg font-semibold mb-3">Your Live Location</h2>
          <div className="bg-gray-100 rounded-xl p-4 text-gray-500">
            📍 Live location will appear here
          </div>
        </div>

        {/* Big SOS Button */}
        <button className="w-48 h-48 mx-auto flex items-center justify-center rounded-full bg-red-600 text-white text-3xl font-extrabold shadow-xl hover:bg-red-700 transition-all active:scale-95">
          SOS
        </button>

        <p className="text-gray-500 text-sm mt-6">
         
        </p>
      </div>
    </div>
  );
}
