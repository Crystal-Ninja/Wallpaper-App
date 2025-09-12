import React from "react";
import Home from "./pages/Home.jsx";
import Profile from "./pages/profile.jsx";
import Favourite from "./pages/favourite.jsx";
import Footer from "./components/Footer.jsx";
import Settings from "./pages/Settings.jsx";
import Spp from "../app.jsx";


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
            <Route path="/profile" element={<Profile />} />
            <Route path="/Favourite" element={<Favourite />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
  );
}

