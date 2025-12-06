import Navbar from "../components/Navbar";

export default function HelplinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#CCF5E9] to-[#E9FFF7]">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
          Emergency Helplines
        </h1>

        <p className="text-gray-600 mb-8">
          Reach trusted emergency support instantly.
        </p>

        <div className="space-y-5">
          {/** Emergency contact list */}
          <HelplineCard label="Police" number="100" />
          <HelplineCard label="Women’s Helpline" number="1091" />
          <HelplineCard label="Ambulance" number="102" />
          <HelplineCard label="Emergency Medical" number="108" />
          <HelplineCard label="Child Helpline" number="1098" />
          <HelplineCard label="Fire & Rescue" number="101" />
          <HelplineCard label="Cyber Crime" number="1930" />
        </div>
      </div>
    </div>
  );
}

// 🔹 Reusable Card Component
function HelplineCard({ label, number }: { label: string; number: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
        <p className="text-gray-500 text-sm">Toll-free helpline</p>
      </div>
      <a
        href={`tel:${number}`}
        className="px-5 py-2 rounded-full bg-[#009c6a] text-white font-semibold hover:bg-[#007a54] transition"
      >
        Call
      </a>
    </div>
  );
}
