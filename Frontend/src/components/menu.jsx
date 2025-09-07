import { useState, useEffect } from "react";
import { Home, Bell, MessageCircle, Settings ,Heart} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function SidebarMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "home", label: "Home", icon: <Home size={24} />, path: "/" },
    { id: "Profile", label: "Profile", icon: <Bell size={24} />, path: "/Profile" },
    { id: "Wallpaper", label: "Wallpaper", icon: <MessageCircle size={24} />, path: "/Wallpaper" },
    { id: "Settings", label: "Settings", icon: <Settings size={24} />, path: "/settings" },
    { id: "Favourite", label: "Favourite", icon: <Heart size={24} />, path: "/Favourite" },

];

  const [active, setActive] = useState("home");

  // update active based on current URL
  useEffect(() => {
    const current = menuItems.find((item) => item.path === location.pathname);
    if (current) setActive(current.id);
  }, [location]);

  const handleNavigation = (item) => {
    setActive(item.id);
    navigate(item.path);
  };

  return (
    <div className="h-screen w-20 bg-gray border-r flex flex-col items-center py-6 space-y-6 shadow-md">
      {/* Logo */}
      <div className="text-blue-600 font-bold text-xl">A</div>

      {/* Menu */}
      <nav className="flex flex-col items-center gap-6 mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item)}
            className={`group relative p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 ${
              active === item.id ? "ring-2 ring-blue-500" : ""
            }`}
          >
            {item.icon}
            {/* Tooltip bubble */}
            <span className="absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap 
              bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 scale-95
              group-hover:opacity-100 group-hover:scale-100 transition">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Profile / Avatar */}
      <div className="relative group w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer">
        <span className="text-gray-700 font-bold">U</span>
        <span className="absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap 
          bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 scale-95
          group-hover:opacity-100 group-hover:scale-100 transition">
          Profile
        </span>
      </div>
    </div>
  );
}
