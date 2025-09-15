import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [active, setActive] = useState("home");
  const navigate = useNavigate(); // ✅ initialize navigate
  const menuItems = [{ id: "profile", label: "Profile", path: "/profile" }];
  useEffect(() => {
    const current = menuItems.find((item) => item.path === location.pathname);
    if (current) setActive(current.id);
  }, [location]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("profile data",res.data)
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfile();
  }, []);

  if (!profile) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
  <div className="bg-base-100 shadow-2xl rounded-3xl p-10 w-[420px] text-center transition transform hover:scale-[1.01] duration-300">
    
    {/* Profile picture */}
    <div className="flex justify-center">
      <img
        src={profile.avatar || "https://via.placeholder.com/150"}
        alt="Profile"
        className="w-32 h-32 rounded-full border-4 border-primary shadow-md object-cover"
      />
    </div>

    {/* Name */}
    <h2 className="mt-6 text-3xl font-bold text-base-content">
      {profile.name || "Anonymous User"}
    </h2>

    {/* Created At */}
    <p className="mt-2 text-sm italic text-neutral-content">
      Joined on {new Date(profile.createdAt).toLocaleDateString()}
    </p>

    {/* Email */}
    <p className="mt-1 text-sm text-neutral-content">{profile.email}</p>

    {/* Divider */}
    <div className="my-6 border-t border-base-300"></div>

    {/* Logout Button */}
    {active === "profile" && (
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
        className="btn btn-primary w-full"
      >
        Logout
      </button>
    )}
  </div>
</div>

);
}