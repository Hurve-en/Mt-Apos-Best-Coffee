import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../hooks/useRedux";
import { loginSuccess } from "../redux/slices/authSlice";
import axios from "axios";
import logo from "../Images/Logo.jpg";
import "../styles/premium.css";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting login with:", formData);
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData,
      );

      console.log("Full response:", response);
      console.log("Response data:", response.data);

      if (response.data && response.data.success) {
        const { token, user } = response.data;
        console.log("Login successful! Token:", token, "User:", user);
        localStorage.setItem("token", token);

        dispatch(
          loginSuccess({
            user,
            token,
          }),
        );

        // Redirect based on role
        if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      } else {
        console.warn("Response success is false:", response.data);
        setError(response.data?.message || "Login failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Login error caught:", err);
      console.error("Error response:", err.response?.data);
      const errorMsg =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-coffee-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-coffee-700 text-pure-white py-12 text-center">
            <img
              src={logo}
              alt="Apo Coffee Logo"
              className="w-24 h-24 mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold mb-2">Apo Coffee</h1>
            <p className="text-lg opacity-90">Welcome back, coffee lover!</p>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-800 font-semibold">⚠️ {error}</p>
              </div>
            )}

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 transition"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-600 hover:text-coffee-900 transition"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-lg w-full bg-coffee-500 text-pure-white hover:bg-coffee-600 shadow-md"
              >
                {loading ? "⏳ Logging in..." : "✓ Login"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 border-opacity-30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-coffee-600">or</span>
              </div>
            </div>

            {/* Register Link */}
            <button
              onClick={() => navigate("/register")}
              type="button"
              className="btn btn-lg w-full border-2 border-coffee-500 text-coffee-500 hover:bg-coffee-50"
            >
              Create New Account
            </button>

            {/* Test Credentials */}
            <div className="bg-neutral-50 border-2 border-neutral-300 border-opacity-30 rounded-lg p-4">
              <p className="text-xs font-bold text-black uppercase tracking-wide mb-3">
                Demo Credentials
              </p>
              <div className="space-y-2 text-xs">
                <div>
                  <p className="text-coffee-700 font-semibold">Customer:</p>
                  <p className="text-coffee-700 font-mono">
                    customer@apocoffee.com
                  </p>
                  <p className="text-coffee-700 font-mono">customer123</p>
                </div>
                <div className="border-t border-neutral-300 border-opacity-30 pt-2">
                  <p className="text-coffee-700 font-semibold">Admin:</p>
                  <p className="text-coffee-700 font-mono">
                    admin@apocoffee.com
                  </p>
                  <p className="text-coffee-700 font-mono">admin123</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-coffee-600">
              By logging in, you agree to our{" "}
              <a href="#" className="text-accent font-semibold hover:underline">
                Terms & Conditions
              </a>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-coffee-600 mt-6">
          Apo Coffee © 2024 - Premium Mt. Apo Arabica
        </p>
      </div>
    </div>
  );
}
