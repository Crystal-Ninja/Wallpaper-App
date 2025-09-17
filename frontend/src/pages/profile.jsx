import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api.js";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(API_ENDPOINTS.PROFILE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("profile data", res.data);
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-100">
        <p className="text-base-content/70">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 ml-20">
      <div className="bg-base-100 shadow-2xl rounded-3xl p-10 w-[420px] text-center transition transform hover:scale-[1.01] duration-300">
        
        {/* Profile picture */}
        <div className="flex justify-center">
          <div className="avatar placeholder">
            <div className="w-32 h-30 bg-primary text-primary-content rounded-full flex items-center justify-center border-4 border-primary shadow-md">
              <span className="text-4xl font-bold">
                {profile.name ? profile.name[0].toUpperCase() : "A"}
              </span>
            </div>
          </div>
        </div>

        {/* Name */}
        <h2 className="mt-6 text-3xl font-bold text-base-content">
          {profile.name || "Anonymous User"}
        </h2>

        {/* Created At */}
        <p className="mt-2 text-sm text-base-content/60">
          Member since {new Date(profile.createdAt).toLocaleDateString()}
        </p>

        {/* Email */}
        <div className="mt-4">
          <div className="badge badge-outline badge-lg">
            {profile.email}
          </div>
        </div>

        {/* Divider */}
        <div className="divider my-6"></div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="btn btn-primary w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
}