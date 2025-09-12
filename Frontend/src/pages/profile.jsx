import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token"); 
        const res = await axios.get("http://localhost:5000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfile();
  }, []);

  if (!profile) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-96 text-center">
        {/* Profile picture */}
        <div className="flex justify-center">
          <img
            src={profile.avatar || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-indigo-500 object-cover"
          />
        </div>

        {/* Name */}
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          {profile.name || "Anonymous User"}
        </h2>

        {/* Created At */}
        <p className="mt-2 text-gray-500 text-sm">
          Joined on {new Date(profile.createdAt).toLocaleDateString()}
        </p>

        {/* Email */}
        <p className="mt-1 text-gray-600 text-sm">{profile.email}</p>

        {/* Button */}

      </div>
    </div>
  );
}
