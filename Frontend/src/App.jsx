import React from "react";
import Home from "./pages/Home.jsx";
import Profile from "./pages/profile.jsx";
import Favourite from "./pages/favourite.jsx";
import Wallpaper from "./pages/Wallpaper.jsx";
import Footer from "./components/Footer.jsx";
import Settings from "./pages/Settings.jsx";


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidebarMenu from "./components/menu.jsx";

export default function App() {
  return (
    
      <div className="flex">
        {/* Sidebar */}
        <SidebarMenu />

        {/* Main content */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/notifications" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Favourite />} />
            <Route path="/settings" element={<Wallpaper />} />
          </Routes>
        </div>
      </div>
  );
}

