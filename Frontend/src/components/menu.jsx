import { useState, useEffect } from "react";
import { Home, Settings, Heart, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function SidebarMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  // Menu items
  const menuItems = [
    { id: "home", label: "Home", icon: <Home size={32} />, path: "/" },
    { id: "profile", label: "Profile", icon: <User size={32} />, path: "/profile" },
    { id: "favourite", label: "Favourite", icon: <Heart size={32} />, path: "/favourite" },
    { id: "settings", label: "Settings", icon: <Settings size={32} />, path: "/settings", bottom: true },
  ];

  const [active, setActive] = useState("home");

  // Update active state when location changes
  useEffect(() => {
    const current = menuItems.find((item) => item.path === location.pathname);
    if (current) setActive(current.id);
  }, [location]);

  // Handle navigation
  const handleNavigation = (item) => {
    setActive(item.id);
    navigate(item.path);
  };

  return (
    
    <div className="fixed left-0 top-0 h-screen w-17 bg-white border-r border-gray-200 flex flex-col items-center py-6 shadow-md z-50">
      {/* Logo */}
      <div className="text-blue-600 font-bold text-2xl mb-10">A</div>
      {/* Top Menu */}
      <nav className="flex flex-col items-center gap-5">
        {menuItems
          .filter((item) => !item.bottom)
          .map((item) => (
          <button key={item.id}
          onClick={() => handleNavigation(item)}
          className={`group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${active === item.id
          ? "bg-blue-500 text-white shadow-lg": "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}>
             <span className="shrink-0">{item.icon}</span>
          </button>
          ))}
      </nav>
      
      {/* Spacer pushes settings to bottom */}
      <div className="flex-1" />
        
      {/* Bottom Menu (settings only) */}
      <nav className="flex flex-col items-center gap-5 mb-4">
        {menuItems
          .filter((item) => item.bottom)
          .map((item) => (
          <button key={item.id} onClick={() => handleNavigation(item)}
            className={`group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
            active === item.id
            ? "bg-blue-500 text-white shadow-lg"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}>
            <span className="shrink-0">{item.icon}</span>
          </button>
          ))}
      </nav>
    </div>
  );
}
