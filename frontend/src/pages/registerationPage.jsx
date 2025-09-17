import { useState } from "react";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(API_ENDPOINTS.REGISTER, {
        username,
        email,
        password,
      });
      const toast = document.createElement("div");
      toast.className = "toast toast-top toast-center z-50";
      toast.innerHTML = `
        <div class="alert alert-success">
          <span>Account created successfully!</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 2000);

      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);

      const toast = document.createElement("div");
      toast.className = "toast toast-top toast-center z-50";
      toast.innerHTML = `
        <div class="alert alert-error">
          <span>Registration failed. Please try again.</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 bg-primary-content rounded-lg"></div>
          </div>
          <h1 className="text-2xl font-semibold text-base-content mb-1">
            Create account
          </h1>
          <p className="text-base-content/60 text-sm">Join our community today</p>
        </div>

        {/* Register Form */}
        <form
          onSubmit={handleRegister}
          className="card bg-base-100 shadow-lg border border-base-300/20"
        >
          <div className="card-body p-6 space-y-4">
            {/* Username */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-sm font-medium text-base-content/80">
                  Full Name
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="input input-bordered w-full pr-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-sm font-medium text-base-content/80">
                  Email
                </span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full pr-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-sm font-medium text-base-content/80">
                  Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="input input-bordered w-full pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Create account"}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-base-content/60 text-sm">
            Already have an account?{" "}
            <button
              type="button"
              className="link link-primary text-sm font-medium"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
