import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Hide header on auth pages
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  // ✅ Load theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  // ✅ Toggle theme
  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ❌ Don't render header on login/register
  if (isAuthPage) return null;

  return (
    <header className="w-full h-108 px-6 flex items-center justify-between shadow-md bg-white dark:bg-gray-800 fixed top-0 left-0 z-50 overflow-hidden">

      {/* Logo */}
      <img
        src={logo}
        alt="logo"
        className="h-10 w-auto object-contain cursor-pointer"
        onClick={() => navigate("/dashboard")}
      />

      {/* Right Controls */}
      <div className="flex items-center gap-4">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition"
        >
          {dark ? "🌙" : "☀️"}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>
    </header>
  );
}