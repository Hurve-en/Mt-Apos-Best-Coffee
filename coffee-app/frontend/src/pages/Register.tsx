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

  const strengthTone =
    passwordStrength <= 1
      ? "bg-red-300"
      : passwordStrength === 2
        ? "bg-amber-300"
        : passwordStrength === 3
          ? "bg-coffee-400"
          : "bg-emerald-400";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#faf5ee_0%,#f4ecdf_52%,#f8f4eb_100%)] px-4 py-8 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(191,145,96,0.18),transparent_62%)]" />
      <div className="pointer-events-none absolute -left-16 top-24 h-72 w-72 rounded-full bg-coffee-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-coffee-300/25 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[rgba(143,91,54,0.16)] bg-[rgba(255,251,245,0.92)] shadow-[0_30px_120px_rgba(61,31,10,0.12)] lg:grid-cols-[0.96fr_1.04fr]">
        <aside className="hidden border-r border-[rgba(143,91,54,0.12)] bg-[linear-gradient(180deg,rgba(69,38,17,0.96),rgba(95,54,28,0.92))] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 px-4 py-2 text-[0.72rem] uppercase tracking-[0.28em] text-white/80">
              Freshly Roasted Access
            </div>
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.25em] text-white/55">
                Join the House
              </p>
              <h1 className="max-w-xl font-['Cormorant_Garamond'] text-6xl font-semibold leading-[0.92] text-white">
                Build your
                <span className="block italic text-[#e9c89c]">
                  Apo Coffee account.
                </span>
              </h1>
              <p className="max-w-md text-base leading-7 text-white/72">
                Keep your order history, move faster through checkout, and stay
                close to limited roasts from the Mt. Apo harvest.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.75rem] border border-white/15 bg-white/8 p-6">
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-white/55">
                Why sign up
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-white/78">
                <li>Save delivery details for smoother repeat orders</li>
                <li>Track every order from checkout to delivery</li>
                <li>Get closer to new releases and reserve lots</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-5">
                <p className="font-['Cormorant_Garamond'] text-4xl font-semibold">
                  3
                </p>
                <p className="mt-2 text-[0.72rem] uppercase tracking-[0.18em] text-white/60">
                  Roast profiles
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-5">
                <p className="font-['Cormorant_Garamond'] text-4xl font-semibold">
                  PH
                </p>
                <p className="mt-2 text-[0.72rem] uppercase tracking-[0.18em] text-white/60">
                  Origin grown
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(248,243,235,0.9))] p-6 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-lg">
            <div className="mb-8 flex items-center gap-4">
              <img
                src={logo}
                alt="Apo Coffee Logo"
                className="h-14 w-14 rounded-full border border-[rgba(143,91,54,0.16)] object-cover shadow-sm"
              />
              <div>
                <p className="font-['Cormorant_Garamond'] text-3xl font-semibold text-coffee-900">
                  Apo Coffee
                </p>
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-coffee-600">
                  Create your account
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="font-['Cormorant_Garamond'] text-5xl font-semibold leading-none text-coffee-900">
                Begin your coffee profile.
              </h2>
              <p className="mt-3 text-sm leading-6 text-coffee-700">
                A few details now gives you a smoother, more premium ordering
                experience every time you return.
              </p>
            </div>

            {errors.submit && (
              <div
                className="mb-6 rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {errors.submit}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700"
                >
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
                  className={`w-full rounded-[1rem] border bg-white/90 px-4 py-3 text-coffee-900 placeholder:text-coffee-500 focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-[rgba(143,91,54,0.16)] focus:border-coffee-500 focus:ring-coffee-200"
                  }`}
                  placeholder="Juan Dela Cruz"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700"
                  >
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
                    className={`w-full rounded-[1rem] border bg-white/90 px-4 py-3 text-coffee-900 placeholder:text-coffee-500 focus:outline-none focus:ring-2 ${
                      errors.email
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-[rgba(143,91,54,0.16)] focus:border-coffee-500 focus:ring-coffee-200"
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700"
                  >
                    Phone number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-[1rem] border border-[rgba(143,91,54,0.16)] bg-white/90 px-4 py-3 text-coffee-900 placeholder:text-coffee-500 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                    placeholder="+63 9XX XXX XXXX"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700"
                >
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
                    className={`w-full rounded-[1rem] border bg-white/90 px-4 py-3 pr-20 text-coffee-900 placeholder:text-coffee-500 focus:outline-none focus:ring-2 ${
                      errors.password
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-[rgba(143,91,54,0.16)] focus:border-coffee-500 focus:ring-coffee-200"
                    }`}
                    placeholder="Use 8+ characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[rgba(143,91,54,0.16)] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-coffee-700 transition hover:bg-coffee-50"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}

                <div className="mt-3 rounded-[1rem] border border-[rgba(143,91,54,0.12)] bg-white/70 p-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-coffee-600">
                    <span>Password strength</span>
                    <span>{strengthLabel}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-coffee-100">
                    <div
                      className={`h-full rounded-full transition-all ${strengthTone}`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700"
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
                    className={`w-full rounded-[1rem] border bg-white/90 px-4 py-3 pr-20 text-coffee-900 placeholder:text-coffee-500 focus:outline-none focus:ring-2 ${
                      errors.confirmPassword
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-[rgba(143,91,54,0.16)] focus:border-coffee-500 focus:ring-coffee-200"
                    }`}
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[rgba(143,91,54,0.16)] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-coffee-700 transition hover:bg-coffee-50"
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
                className="w-full rounded-full bg-coffee-900 px-4 py-3 text-sm font-medium uppercase tracking-[0.16em] text-white transition hover:bg-coffee-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-coffee-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-medium text-coffee-900 underline-offset-4 hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
