import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../Images/Logo.jpg";
import { useAppDispatch } from "../hooks/useRedux";
import { loginSuccess } from "../redux/slices/authSlice";
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
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData,
      );

      if (response.data && response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);

        dispatch(
          loginSuccess({
            user,
            token,
            refreshToken: response.data.refreshToken || "",
          }),
        );

        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError(response.data?.message || "Login failed. Please try again.");
      }
    } catch (err: unknown) {
      const errorMsg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : "Login failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#faf5ee_0%,#f4ecdf_52%,#f8f4eb_100%)] px-4 py-8 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(191,145,96,0.18),transparent_62%)]" />
      <div className="pointer-events-none absolute -left-16 top-24 h-72 w-72 rounded-full bg-coffee-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-coffee-300/25 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[rgba(143,91,54,0.16)] bg-[rgba(255,251,245,0.92)] shadow-[0_30px_120px_rgba(61,31,10,0.12)] lg:grid-cols-[1.08fr_0.92fr]">
        <aside className="hidden border-r border-[rgba(143,91,54,0.12)] bg-[linear-gradient(180deg,rgba(69,38,17,0.96),rgba(95,54,28,0.92))] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 px-4 py-2 text-[0.72rem] uppercase tracking-[0.28em] text-white/80">
              Mt. Apo Single Origin
            </div>
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.25em] text-white/55">
                Welcome Back
              </p>
              <h1 className="max-w-xl font-['Cormorant_Garamond'] text-6xl font-semibold leading-[0.92] text-white">
                Step back into your daily
                <span className="block italic text-[#e9c89c]">coffee ritual.</span>
              </h1>
              <p className="max-w-md text-base leading-7 text-white/72">
                Sign in to revisit your favorite roasts, track every order, and
                move through checkout with the same calm premium feel as the
                Apo Coffee experience.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.75rem] border border-white/15 bg-white/8 p-6">
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-white/55">
                Demo Access
              </p>
              <div className="mt-4 grid gap-4 text-sm text-white/78">
                <div>
                  <p className="font-medium text-white">Customer</p>
                  <p className="font-mono text-[0.82rem] text-[#f6e7d3]">
                    customer@apocoffee.com
                  </p>
                  <p className="font-mono text-[0.82rem] text-[#f6e7d3]">
                    customer123
                  </p>
                </div>
                <div className="border-t border-white/12 pt-4">
                  <p className="font-medium text-white">Admin</p>
                  <p className="font-mono text-[0.82rem] text-[#f6e7d3]">
                    admin@apocoffee.com
                  </p>
                  <p className="font-mono text-[0.82rem] text-[#f6e7d3]">
                    admin123
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-5">
                <p className="font-['Cormorant_Garamond'] text-4xl font-semibold">
                  24h
                </p>
                <p className="mt-2 text-[0.72rem] uppercase tracking-[0.18em] text-white/60">
                  Fresh roast window
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-5">
                <p className="font-['Cormorant_Garamond'] text-4xl font-semibold">
                  100%
                </p>
                <p className="mt-2 text-[0.72rem] uppercase tracking-[0.18em] text-white/60">
                  Single origin beans
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(248,243,235,0.9))] p-6 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md">
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
                  Sign in to your account
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="font-['Cormorant_Garamond'] text-5xl font-semibold leading-none text-coffee-900">
                Welcome back.
              </h2>
              <p className="mt-3 text-sm leading-6 text-coffee-700">
                Continue to your orders, curated menu picks, and your saved
                customer details.
              </p>
            </div>

            {error && (
              <div
                className="mb-6 rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
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
                  className="w-full rounded-[1rem] border border-[rgba(143,91,54,0.16)] bg-white/90 px-4 py-3 text-coffee-900 placeholder:text-coffee-500 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-[1rem] border border-[rgba(143,91,54,0.16)] bg-white/90 px-4 py-3 pr-20 text-coffee-900 placeholder:text-coffee-500 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[rgba(143,91,54,0.16)] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-coffee-700 transition hover:bg-coffee-50"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-coffee-900 px-4 py-3 text-sm font-medium uppercase tracking-[0.16em] text-white transition hover:bg-coffee-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-[rgba(143,91,54,0.16)]" />
              <span className="text-[0.68rem] uppercase tracking-[0.24em] text-coffee-500">
                New here?
              </span>
              <div className="h-px flex-1 bg-[rgba(143,91,54,0.16)]" />
            </div>

            <button
              onClick={() => navigate("/register")}
              type="button"
              className="w-full rounded-full border border-[rgba(143,91,54,0.22)] bg-white/80 px-4 py-3 text-sm font-medium uppercase tracking-[0.16em] text-coffee-900 transition hover:bg-coffee-50"
            >
              Create an account
            </button>

            <p className="mt-6 text-center text-xs text-coffee-600">
              By signing in, you agree to our Terms & Conditions.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
