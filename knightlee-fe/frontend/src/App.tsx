// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import "mapbox-gl/dist/mapbox-gl.css";
// import KnightleeLanding from "./components/KnightleeMap"; 

// // Pages / Components
// import HomeLanding from "./pages/Landing"; 
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Home from "./pages/Home";
// import KnightleeMap from "./components/KnightleeMap";

// // 🔒 Protected Route Wrapper
// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         Loading...
//       </div>
//     );
//   }

//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// const AppRoutes = () => {
//   const { isAuthenticated, logout } = useAuth();

//   return (
//     <Routes>
//       {/* ⭐ Default page (Landing) */}
//       <Route
//         path="/"
//         element={<HomeLanding />}
//       />

//       {/* Auth pages */}
//       <Route
//         path="/login"
//         // element={!isAuthenticated ? <Login /> : <Navigate to="/home" replace />}
//         element={<Login/>}
//       />
//       <Route
//         path="/signup"
//         element={<Signup/>}
//         // element={!isAuthenticated ? <Signup /> : <Navigate to="/home" replace />}
//       />

//       {/* Home + KnightleeMap after login */}
//       {/* <Route
//         path="/home"
//         element={
//           <ProtectedRoute>
//             <Home />
//             <KnightleeMap onLogout={logout} />
//           </ProtectedRoute>
//         }
//       /> */}
//       <Route
//   path="/home"
//   element={
//     <ProtectedRoute>
//       <Home />
//     </ProtectedRoute>
//   }
// />

// <Route
//   path="/map"
//   element={
//     <ProtectedRoute>
//       <KnightleeMap onLogout={logout} />
//     </ProtectedRoute>
//   }
// />


//       {/* 404 fallback */}
//       <Route
//         path="*"
//         element={
//           <h1 className="text-center pt-10 text-xl">
//             404 — Page Not Found
//           </h1>
//         }
//       />
//     </Routes>
//   );
// };

// // 🌍 Main App Wrapper
// export default function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <AppRoutes />
//       </Router>
//     </AuthProvider>
//   );
// }
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "mapbox-gl/dist/mapbox-gl.css";

import MapScreen from "./pages/MapScreen";
import HelplinePage from "./pages/HelplinePage";
import SOSPage from "./pages/SOSPage";
import SafePointsPage from "./pages/SafePointsPage";

// Pages / Components
import HomeLanding from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import HeatMap from "./pages/CrimeHeatmap"
import KnightleeMap from "./components/KnightleeMap";
import CrimeHeatmap from "./components/crimeHeatmap"; // ⬅️ your heatmap component

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { logout } = useAuth();

  return (
    <Routes>
      {/* Public landing */}
      <Route path="/" element={<HomeLanding />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected main home */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Map screens */}
      <Route
        path="/mapscreen"
        element={
          <ProtectedRoute>
            <MapScreen />
          </ProtectedRoute>
        }
      />
     <Route
        path="/heatmap"
        element={
          <ProtectedRoute>
            <CrimeHeatmap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <KnightleeMap onLogout={logout} />
          </ProtectedRoute>
        }
      />

      {/* Helpline page */}
      <Route
        path="/helpline"
        element={
          <ProtectedRoute>
            <HelplinePage />
          </ProtectedRoute>
        }
      />

      {/* SOS page */}
      <Route
        path="/sos"
        element={
          <ProtectedRoute>
            <SOSPage />
          </ProtectedRoute>
        }
      />

      {/* Safe Points page */}
      <Route
        path="/safepoints"
        element={
          <ProtectedRoute>
            <SafePointsPage />
          </ProtectedRoute>
        }
      />

      {/* Crime Heatmap page */}
      <Route
        path="/heatmap"
        element={
          <ProtectedRoute>
            <HeatMap />
          </ProtectedRoute>
        }
      />

      {/* 404 fallback */}
      <Route
        path="*"
        element={
          <h1 className="text-center pt-10 text-xl">
            404 — Page Not Found
          </h1>
        }
      />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};


