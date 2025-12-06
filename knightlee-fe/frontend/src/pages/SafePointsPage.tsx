import Navbar from "../components/Navbar";
import { MapPin, ShieldAlert, Hospital, Store, Users } from "lucide-react";

export default function SafePointsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#CCF5E9] to-[#E9FFF7]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Nearest Safe Points
        </h1>

        

        {/* Live Location (placeholder for now) */}
        <div className="bg-white rounded-3xl shadow-md p-6 mb-8 flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#e0f2fe] flex items-center justify-center">
            <MapPin className="w-6 h-6 text-[#0284c7]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Your Live Location
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              📍 Live location will appear here in the full version.
            </p>
          </div>
        </div>

        {/* Nearby Safe Places – static prototype list */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Nearby Safe Places 
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Police Station */}
          <SafePlaceCard
            icon={<ShieldAlert className="w-6 h-6 text-[#dc2626]" />}
            title="Nearby Police Station"
            description="Move towards the nearest police station for immediate safety and legal support."
            distance="~500m away (sample)"
          />

          {/* Hospital */}
          <SafePlaceCard
            icon={<Hospital className="w-6 h-6 text-[#16a34a]" />}
            title="Nearest Hospital"
            description="Hospitals are safe, staffed locations where you can get medical help and protection."
            distance="~1.2 km away (sample)"
          />

          {/* 24x7 Shop */}
          <SafePlaceCard
            icon={<Store className="w-6 h-6 text-[#ea580c]" />}
            title="24x7 Open Shop"
            description="Well-lit, open shops or fuel stations are safer during late hours."
            distance="~800m away (sample)"
          />

          {/* Public Crowd Area */}
          <SafePlaceCard
            icon={<Users className="w-6 h-6 text-[#2563eb]" />}
            title="Crowded Public Area"
            description="Move towards busy junctions, bus stops, or metro stations where people are around."
            distance="~600m away (sample)"
          />
        </div>
      </div>
    </div>
  );
}

function SafePlaceCard({
  icon,
  title,
  description,
  distance,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  distance: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-2">
      <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      <p className="text-gray-400 text-xs mt-1">{distance}</p>
    </div>
  );
}
