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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-coffee-50 via-white to-coffee-100 px-4 py-8 sm:py-12">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-coffee-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-coffee-300/30 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-coffee-200 bg-white shadow-2xl lg:grid-cols-[1.05fr_1fr]">
        <aside className="hidden bg-coffee-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              Mt. Apo Arabica
            </div>
            <h1 className="mb-4 text-4xl font-bold leading-tight text-white">
              Welcome back.
              <br />
              Your coffee ritual is waiting.
            </h1>
            <p className="max-w-sm text-base text-coffee-100">
              Sign in to track orders, collect rewards, and get quick access to
              your favorite blends.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-coffee-100">
              Demo Credentials
            </p>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-white">Customer</p>
                <p className="font-mono text-coffee-100">customer@apocoffee.com</p>
                <p className="font-mono text-coffee-100">customer123</p>
              </div>
              <div className="border-t border-white/20 pt-3">
                <p className="font-semibold text-white">Admin</p>
                <p className="font-mono text-coffee-100">admin@apocoffee.com</p>
                <p className="font-mono text-coffee-100">admin123</p>
              </div>
            </div>
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
                  Sign in to your account
                </p>
              </div>
            </div>

            {error && (
              <div
                className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
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
                  className="w-full rounded-xl border border-coffee-200 bg-white px-4 py-3 text-coffee-900 placeholder:text-coffee-400 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-semibold text-coffee-900">
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
                    className="w-full rounded-xl border border-coffee-200 bg-white px-4 py-3 pr-20 text-coffee-900 placeholder:text-coffee-400 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm font-semibold text-coffee-700 hover:bg-coffee-100"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-coffee-800 px-4 py-3 text-base font-semibold text-white transition hover:bg-coffee-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-coffee-200" />
              <span className="text-xs uppercase tracking-[0.16em] text-coffee-500">
                New here?
              </span>
              <div className="h-px flex-1 bg-coffee-200" />
            </div>

            <button
              onClick={() => navigate("/register")}
              type="button"
              className="w-full rounded-xl border border-coffee-300 bg-white px-4 py-3 text-base font-semibold text-coffee-900 transition hover:bg-coffee-50"
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
