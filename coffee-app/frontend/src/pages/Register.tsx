import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useRedux";
import { loginSuccess } from "../redux/slices/authSlice";
import axios from "axios";
import logo from "../Images/Logo.jpg";
import "../styles/premium.css";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone || undefined,
        },
      );

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);

        dispatch(
          loginSuccess({
            user,
            token,
          }),
        );

        navigate("/");
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Registration failed. Please try again.";
      setErrors({ submit: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gray-800 text-white py-12 text-center">
            <img
              src={logo}
              alt="Apo Coffee Logo"
              className="w-24 h-24 mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold mb-2">Apo Coffee</h1>
            <p className="text-lg opacity-90">Join our coffee community!</p>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-5">
            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-800 font-semibold">⚠️ {errors.submit}</p>
              </div>
            )}

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.name
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-accent"
                  }`}
                  placeholder="Juan Dela Cruz"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">✕ {errors.name}</p>
                )}
              </div>

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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.email
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-accent"
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">✕ {errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  Phone Number (Optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition"
                  placeholder="+63 9XX XXX XXXX"
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
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.password
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-accent"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-black transition"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    ✕ {errors.password}
                  </p>
                )}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full ${
                            i <= passwordStrength
                              ? i === 1
                                ? "bg-red-500"
                                : i === 2
                                  ? "bg-yellow-500"
                                  : i === 3
                                    ? "bg-blue-500"
                                    : "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted mt-1">
                      {passwordStrength === 0
                        ? "Very Weak"
                        : passwordStrength === 1
                          ? "Weak"
                          : passwordStrength === 2
                            ? "Fair"
                            : passwordStrength === 3
                              ? "Good"
                              : "Strong"}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-accent"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-black transition"
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    ✕ {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg w-full"
              >
                {loading ? "⏳ Creating Account..." : "✓ Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 border-opacity-30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted">or</span>
              </div>
            </div>

            {/* Login Link */}
            <button
              onClick={() => navigate("/login")}
              type="button"
              className="btn btn-secondary btn-lg w-full"
            >
              Already Have an Account? Login
            </button>

            {/* Terms */}
            <p className="text-center text-xs text-muted">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-accent font-semibold hover:underline">
                Terms & Conditions
              </a>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-muted mt-6">
          Apo Coffee © 2024 - Premium Mt. Apo Arabica
        </p>
      </div>
    </div>
  );
}
