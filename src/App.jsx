import React from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/profile";
import Favourite from "./pages/favourite";
import Wallpaper from "./pages/Wallpaper";
import Footer from "./components/Carousel/Footer.jsx";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Carousel/Navbar.jsx";
const App = () => {
  return (
    <div className="w-full h-[90vh]">
      <Navbar />
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/About" element={<About />}></Route>
          <Route path="/Favourite" element={<Favourite />}></Route>
          <Route path="/Profile" element={<Profile />}></Route>
          <Route path="/Wallpaper" element={<Wallpaper />}></Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
