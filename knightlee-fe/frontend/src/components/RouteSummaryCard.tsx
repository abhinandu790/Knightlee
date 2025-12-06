import { Route as RouteIcon, Shield } from "lucide-react";

interface RouteSummaryCardProps {
  route: {
    distance: number;
    safetyScore: number;
    blackspots: number;
    type: "fastest" | "safest";
  };
}

export default function RouteSummaryCard({ route }: RouteSummaryCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-100 dark:bg-emerald-900";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900";
    return "bg-red-100 dark:bg-red-900";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md mx-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Route Summary
        </h3>
        <div className={`px-3 py-1 rounded-full ${getScoreBg(route.safetyScore)}`}>
          <span className={`text-sm font-semibold ${getScoreColor(route.safetyScore)}`}>
            {route.type === "safest" ? "Safest Route" : "Fastest Route"}
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Distance */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <RouteIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {route.distance}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">km</p>
        </div>

        {/* Safety */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Shield className={`w-5 h-5 ${getScoreColor(route.safetyScore)}`} />
          </div>
          <p className={`text-2xl font-bold ${getScoreColor(route.safetyScore)}`}>
            {route.safetyScore}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">safety score</p>
        </div>
      </div>

      {/* ⚠ Blackspot information */}
      <div className="mt-3 p-3 bg-red-500 dark:bg-gray-700 rounded-lg">
        <p className="text-sm font-medium text-gray-700 text-center">
          ⚠ {route.blackspots} blackspots detected along this route
        </p>
      </div>

      {/* Safety Recommendation Box for Safest Route */}
      {route.type === "safest" && (
        <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <p className="text-sm text-emerald-800 dark:text-emerald-300 text-center leading-relaxed">
            <span className="font-semibold">Recommended for better safety.</span>
            <br />This route avoids high-risk areas and improves user safety.
          </p>
        </div>
      )}
    </div>
  );
}
