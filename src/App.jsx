import React from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/profile";
import Favourite from "./pages/favourite";
import Wallpaper from "./pages/Wallpaper";
import { Routes, Route,Link } from "react-router-dom";
import CardExample from "./components/Carousel/Carousel";
const App = () => {
  return (
    <div>
      <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        <Link to={"/"}>Home</Link>
        <Link to={"/About"}>About</Link>
        <Link to={"/Favourite"}>Favourite</Link>
        <Link to={"/Profile"}>Profile</Link>
        <Link to={"/Wallpaper"}>Wallpaper</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/About" element={<About/>}></Route>
        <Route path="/Favourite" element={<Favourite/>}></Route>
        <Route path="/Profile" element={<Profile/>}></Route>
        <Route path="/Wallpaper" element={<Wallpaper/>}></Route>
      </Routes>


      <h1 className="text-center text-3xl font-bold mt-8 mb-4">wallpaper App</h1>
      <CardExample />
    </div>
  );
};

export default App;
