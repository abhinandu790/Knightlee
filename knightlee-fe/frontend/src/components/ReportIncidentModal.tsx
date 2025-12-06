import { useState } from "react";

export default function ReportIncidentModal({ onClose }: { onClose: () => void }) {
  const [incidentType, setIncidentType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const isFormValid = incidentType !== "" && location.trim() !== "" && description.trim() !== "";

  const handleSubmit = () => {
    if (!isFormValid) return;

    // Later you can send this to backend
    console.log({
      incidentType,
      location,
      description,
    });

    onClose(); // close modal after submission
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="bg-white w-[90%] md:w-[450px] rounded-3xl shadow-xl p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-1">Report Incident</h2>
        <p className="text-gray-600 mb-5 text-sm">
          Tell us what happened to help others stay safe.
        </p>

        {/* Incident Type Dropdown */}
        <select
          className="w-full px-4 py-2 border rounded-xl mb-3 text-gray-700"
          value={incidentType}
          onChange={(e) => setIncidentType(e.target.value)}
        >
          <option value="" disabled>
            Select incident type
          </option>
          <option value="harassment">Harassment</option>
          <option value="theft">Theft</option>
          <option value="stray_dogs">Stray Dogs</option>
          <option value="dark_road">Dark / Isolated Road</option>
          <option value="accident">Accident</option>
          <option value="vandalism">Vandalism / Property Damage</option>
          <option value="suspicious_activity">Suspicious Activity</option>
          <option value="other">Other</option>
        </select>

        {/* Location */}
        <input
          type="text"
          placeholder="Type location here"
          className="w-full px-4 py-2 border rounded-xl mb-3"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Description */}
        <textarea
          placeholder="Describe what happened"
          className="w-full px-4 py-2 border rounded-xl mb-4"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`w-full py-3 rounded-full font-semibold transition
            ${isFormValid
              ? "bg-[#009c6a] text-white hover:bg-[#008458]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Submit Report
        </button>
      </div>
    </div>
  );
}
