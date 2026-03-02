import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../Images/Logo.jpg";
import { useAppDispatch } from "../hooks/useRedux";
import { loginSuccess } from "../redux/slices/authSlice";
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
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^a-zA-Z\d]/.test(password)) strength += 1;

    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone || undefined,
      });

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);

        dispatch(
          loginSuccess({
            user,
            token,
            refreshToken: response.data.refreshToken || "",
          }),
        );

        navigate("/");
      }
    } catch (err: unknown) {
      const errorMsg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : "Registration failed. Please try again.";
      setErrors({ submit: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const strengthLabel =
    passwordStrength <= 1
      ? "Weak"
      : passwordStrength === 2
        ? "Fair"
        : passwordStrength === 3
          ? "Good"
          : "Strong";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-coffee-50 via-white to-coffee-100 px-4 py-8 sm:py-12">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-coffee-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-coffee-300/30 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-coffee-200 bg-white shadow-2xl lg:grid-cols-[1fr_1.1fr]">
        <aside className="hidden bg-coffee-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              Freshly Brewed Access
            </div>
            <h1 className="mb-4 text-4xl font-bold leading-tight text-white">
              Create your account.
              <br />
              Start your best coffee days.
            </h1>
            <p className="max-w-sm text-base text-coffee-100">
              Save favorites, track deliveries, and earn loyalty perks across
              every cup.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <p className="mb-2 text-sm font-semibold text-white">Why sign up?</p>
            <ul className="space-y-2 text-sm text-coffee-100">
              <li>Faster checkout for repeat orders</li>
              <li>Order tracking in one place</li>
              <li>Priority access to new blends</li>
            </ul>
          </div>
        </aside>

        <main className="p-6 sm:p-10">
          <div className="mx-auto max-w-md">
            <div className="mb-8 flex items-center gap-3">
              <img
                src={logo}
                alt="Apo Coffee Logo"
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div>
                <p className="text-xl font-bold text-coffee-900">Apo Coffee</p>
                <p className="text-xs uppercase tracking-[0.16em] text-coffee-600">
                  Create your account
                </p>
              </div>
            </div>

            {errors.submit && (
              <div
                className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {errors.submit}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-coffee-900">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-coffee-900 placeholder:text-coffee-400 focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-coffee-200 focus:border-coffee-500 focus:ring-coffee-200"
                  }`}
                  placeholder="Juan Dela Cruz"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-coffee-900">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-coffee-900 placeholder:text-coffee-400 focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-coffee-200 focus:border-coffee-500 focus:ring-coffee-200"
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-coffee-900">
                  Phone number <span className="text-coffee-500">(optional)</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-coffee-200 bg-white px-4 py-3 text-coffee-900 placeholder:text-coffee-400 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                  placeholder="+63 9XX XXX XXXX"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-coffee-900">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full rounded-xl border bg-white px-4 py-3 pr-20 text-coffee-900 placeholder:text-coffee-400 focus:outline-none focus:ring-2 ${
                      errors.password
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-coffee-200 focus:border-coffee-500 focus:ring-coffee-200"
                    }`}
                    placeholder="Use 8+ characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm font-semibold text-coffee-700 hover:bg-coffee-100"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}

                {formData.password && (
                  <div className="mt-2">
                    <div className="flex h-2 gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`flex-1 rounded-full ${
                            level <= passwordStrength
                              ? level <= 1
                                ? "bg-red-500"
                                : level === 2
                                  ? "bg-orange-400"
                                  : level === 3
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              : "bg-coffee-100"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-coffee-600">Strength: {strengthLabel}</p>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-coffee-900"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full rounded-xl border bg-white px-4 py-3 pr-20 text-coffee-900 placeholder:text-coffee-400 focus:outline-none focus:ring-2 ${
                      errors.confirmPassword
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-coffee-200 focus:border-coffee-500 focus:ring-coffee-200"
                    }`}
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm font-semibold text-coffee-700 hover:bg-coffee-100"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-coffee-800 px-4 py-3 text-base font-semibold text-white transition hover:bg-coffee-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-coffee-200" />
              <span className="text-xs uppercase tracking-[0.16em] text-coffee-500">
                Already registered?
              </span>
              <div className="h-px flex-1 bg-coffee-200" />
            </div>

            <button
              onClick={() => navigate("/login")}
              type="button"
              className="w-full rounded-xl border border-coffee-300 bg-white px-4 py-3 text-base font-semibold text-coffee-900 transition hover:bg-coffee-50"
            >
              Sign in instead
            </button>

            <p className="mt-6 text-center text-xs text-coffee-600">
              By creating an account, you agree to our Terms & Conditions.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
