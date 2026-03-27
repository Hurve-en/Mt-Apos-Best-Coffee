import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useRedux";
import {
  loginSuccess,
  loginFailure,
  setLoading,
} from "../redux/slices/authSlice";
import axios from "axios";
import "../styles/premium.css";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoadingState] = useState(false);

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
    setLoadingState(true);
    dispatch(setLoading(true));

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData,
      );
      dispatch(
        loginSuccess({
          user: response.data.user,
          token: response.data.token,
          refreshToken: response.data.refreshToken,
        }),
      );
      navigate("/admin/dashboard");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Login failed";
      setError(errorMsg);
      dispatch(loginFailure(errorMsg));
    } finally {
      setLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8f1e7_0%,#efe4d1_100%)] px-4 py-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(191,145,96,0.18),transparent_62%)]" />
      <div className="pointer-events-none absolute left-0 top-20 h-80 w-80 rounded-full bg-coffee-200/25 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-coffee-300/25 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-[rgba(143,91,54,0.16)] bg-[rgba(255,252,247,0.92)] shadow-[0_30px_120px_rgba(61,31,10,0.14)] lg:grid-cols-[0.95fr_1.05fr]">
          <section className="hidden border-r border-[rgba(143,91,54,0.12)] bg-[linear-gradient(180deg,rgba(69,38,17,0.96),rgba(95,54,28,0.92))] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="space-y-7">
              <p className="inline-flex w-fit rounded-full border border-white/20 px-4 py-2 text-[0.72rem] uppercase tracking-[0.24em] text-white/78">
                Admin Studio
              </p>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.22em] text-white/55">
                  Control Room
                </p>
                <h1 className="font-['Cormorant_Garamond'] text-6xl font-semibold leading-[0.92]">
                  Guide the
                  <span className="block italic text-[#e9c89c]">
                    Apo Coffee floor.
                  </span>
                </h1>
                <p className="max-w-md text-base leading-7 text-white/72">
                  Manage products, orders, and the daily rhythm of the shop
                  from one calm workspace.
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/14 bg-white/8 p-6">
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-white/55">
                Test Admin Account
              </p>
              <p className="mt-4 text-sm text-white/80">Email: admin@apocoffee.com</p>
              <p className="text-sm text-white/80">Password: admin123</p>
            </div>
          </section>

          <section className="p-6 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-coffee-600">
                  Mt. Apo Coffee
                </p>
                <h1 className="mt-3 font-['Cormorant_Garamond'] text-5xl font-semibold leading-none text-coffee-900">
                  Admin portal
                </h1>
                <p className="mt-3 text-sm leading-6 text-coffee-700">
                  Sign in to review orders, update product listings, and keep
                  the storefront moving smoothly.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <div className="rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700"
                  >
                    Admin email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-[1rem] border border-[rgba(143,91,54,0.16)] bg-white/90 px-4 py-3 text-coffee-900 placeholder:text-coffee-500 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                    placeholder="admin@apocoffee.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-[1rem] border border-[rgba(143,91,54,0.16)] bg-white/90 px-4 py-3 text-coffee-900 placeholder:text-coffee-500 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-coffee-900 px-4 py-3 text-sm font-medium uppercase tracking-[0.16em] text-white transition hover:bg-coffee-800 disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Enter admin dashboard"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-coffee-600">
                Not an admin?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="font-medium text-coffee-900 underline-offset-4 hover:underline"
                >
                  Customer login
                </button>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
