import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-b from-white to-[#E9FFF7] border-b border-[#b7f3e3]">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/home" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#08a870] rounded-2xl flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" strokeWidth="2" stroke="white"
              className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold text-gray-900">
            Knightlee
          </span>
        </Link>

        {/* Heatmap + Logout */}
        <div className="flex items-center gap-10 text-lg font-semibold">
          <Link
            to="/heatmap"
            className={`transition ${
              isActive("/heatmap") ? "text-[#009c6a]" : "text-[#009c6a] hover:opacity-80"
            }`}
          >
            Heatmap
          </Link>

          <button
            onClick={handleLogout}
            className="text-[#e11d48] hover:opacity-80 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
