import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/useRedux";
import { logout } from "../redux/slices/authSlice";
import { apiService } from "../services/api";
import "../styles/premium.css";

interface Order {
  id: number;
  createdAt: string;
  total: number;
  deliveryAddress: string;
  status: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state: any) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<"settings" | "orders">("settings");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }

    void fetchOrders();
  }, [isAuthenticated, navigate, user]);

  const fetchOrders = async () => {
    try {
      const data = await apiService.getOrders();
      const normalized = (Array.isArray(data) ? data : []).map((order: any) => ({
        id: Number(order.id),
        createdAt: String(order.createdAt),
        total: Number(order.total ?? order.totalPrice ?? 0),
        deliveryAddress: String(order.deliveryAddress || ""),
        status: String(order.status || "pending").toLowerCase(),
      }));
      setOrders(normalized);
    } catch (_error) {
      setOrders([]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await apiService.updateProfile({
        name: formData.name,
      });

      setMessage({
        type: "success",
        text: "Profile updated successfully.",
      });
      setTimeout(() => setMessage(null), 2500);
    } catch (_error) {
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return "N/A";
    return new Date(user.createdAt).toLocaleDateString();
  }, [user?.createdAt]);

  const statusPill = (status: string) => {
    if (status === "delivered") return "bg-emerald-100 text-emerald-900";
    if (status === "pending") return "bg-amber-100 text-amber-900";
    if (status === "cancelled") return "bg-red-100 text-red-900";
    return "bg-stone-100 text-stone-800";
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8f3ea_0%,#f2e8da_42%,#f7f2e8_100%)]">
      <section className="border-b border-[rgba(143,91,54,0.12)] bg-[rgba(255,251,245,0.88)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-[0.72rem] uppercase tracking-[0.26em] text-coffee-500">
            Customer Journal
          </p>
          <h1 className="mt-3 font-['Cormorant_Garamond'] text-5xl font-semibold leading-none text-coffee-900 sm:text-6xl">
            My Account
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-coffee-700 sm:text-base">
            Keep your details updated, return to past orders, and manage your
            Apo Coffee experience in one warm, familiar place.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
          <aside>
            <div className="rounded-[2rem] border border-[rgba(143,91,54,0.14)] bg-[linear-gradient(180deg,rgba(255,251,245,0.95),rgba(247,241,232,0.92))] p-7 shadow-[0_24px_80px_rgba(61,31,10,0.08)] lg:sticky lg:top-24">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-coffee-900 font-['Cormorant_Garamond'] text-3xl font-semibold text-white">
                {user?.name?.[0] || "U"}
              </div>
              <h2 className="mt-5 font-['Cormorant_Garamond'] text-4xl font-semibold leading-none text-coffee-900">
                {user?.name || "User"}
              </h2>
              <p className="mt-2 break-all text-sm text-coffee-700">{user?.email}</p>

              <div className="mt-7 space-y-3">
                <div className="rounded-[1.25rem] border border-[rgba(143,91,54,0.12)] bg-white/70 p-4">
                  <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-coffee-500">
                    Phone
                  </p>
                  <p className="mt-2 text-sm font-medium text-coffee-900">
                    {user?.phone || "Not set"}
                  </p>
                </div>

                <div className="rounded-[1.25rem] border border-[rgba(143,91,54,0.12)] bg-white/70 p-4">
                  <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-coffee-500">
                    Member Since
                  </p>
                  <p className="mt-2 text-sm font-medium text-coffee-900">{memberSince}</p>
                </div>

                <div className="rounded-[1.25rem] border border-[rgba(143,91,54,0.12)] bg-white/70 p-4">
                  <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-coffee-500">
                    Total Orders
                  </p>
                  <p className="mt-2 text-sm font-medium text-coffee-900">{orders.length}</p>
                </div>
              </div>

              <button onClick={handleLogout} className="btn btn-secondary w-full mt-7">
                Logout
              </button>
            </div>
          </aside>

          <div>
            <div className="mb-6 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab("settings")}
                className={`rounded-full px-5 py-2.5 text-[0.78rem] font-medium uppercase tracking-[0.16em] transition ${
                  activeTab === "settings"
                    ? "bg-coffee-900 text-white shadow-sm"
                    : "border border-[rgba(143,91,54,0.18)] bg-white/70 text-coffee-700 hover:bg-white"
                }`}
              >
                Account Settings
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`rounded-full px-5 py-2.5 text-[0.78rem] font-medium uppercase tracking-[0.16em] transition ${
                  activeTab === "orders"
                    ? "bg-coffee-900 text-white shadow-sm"
                    : "border border-[rgba(143,91,54,0.18)] bg-white/70 text-coffee-700 hover:bg-white"
                }`}
              >
                Order History ({orders.length})
              </button>
            </div>

            {activeTab === "settings" && (
              <div className="rounded-[2rem] border border-[rgba(143,91,54,0.14)] bg-[linear-gradient(180deg,rgba(255,251,245,0.95),rgba(247,241,232,0.92))] p-6 shadow-[0_24px_80px_rgba(61,31,10,0.08)] md:p-8">
                <h3 className="font-['Cormorant_Garamond'] text-4xl font-semibold leading-none text-coffee-900">
                  Personal Information
                </h3>
                <p className="mt-3 text-sm leading-6 text-coffee-700">
                  Update the details we use for your future orders.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <label className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-[1rem] border border-[rgba(143,91,54,0.16)] bg-white/90 px-4 py-3 text-coffee-900 placeholder:text-coffee-500 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full cursor-not-allowed rounded-[1rem] border border-[rgba(143,91,54,0.12)] bg-[#f3ecdf] px-4 py-3 text-coffee-700"
                    />
                    <p className="mt-2 text-xs text-coffee-600">Email cannot be changed.</p>
                  </div>

                  <div>
                    <label className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+63 9XX XXX XXXX"
                      className="w-full rounded-[1rem] border border-[rgba(143,91,54,0.16)] bg-white/90 px-4 py-3 text-coffee-900 placeholder:text-coffee-500 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700">
                      Default Delivery Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street address, building, apartment, etc."
                      rows={4}
                      className="w-full rounded-[1rem] border border-[rgba(143,91,54,0.16)] bg-white/90 px-4 py-3 text-coffee-900 placeholder:text-coffee-500 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                    />
                  </div>

                  {message && (
                    <div
                      className={`rounded-[1rem] px-4 py-3 text-sm font-medium ${
                        message.type === "success"
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border border-red-200 bg-red-50 text-red-800"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <button type="submit" disabled={loading} className="btn btn-primary">
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          name: user?.name || "",
                          email: user?.email || "",
                          phone: user?.phone || "",
                          address: user?.address || "",
                        })
                      }
                      className="btn btn-secondary"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="rounded-[2rem] border border-[rgba(143,91,54,0.14)] bg-[linear-gradient(180deg,rgba(255,251,245,0.95),rgba(247,241,232,0.92))] p-10 text-center shadow-[0_24px_80px_rgba(61,31,10,0.08)]">
                    <h3 className="font-['Cormorant_Garamond'] text-4xl font-semibold text-coffee-900">
                      No Orders Yet
                    </h3>
                    <p className="mt-3 text-sm text-coffee-700">
                      You haven&apos;t placed any orders yet.
                    </p>
                    <button onClick={() => navigate("/menu")} className="btn btn-primary mt-6">
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  orders.map((order) => (
                    <button
                      key={order.id}
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="w-full rounded-[1.75rem] border border-[rgba(143,91,54,0.14)] bg-[linear-gradient(180deg,rgba(255,251,245,0.95),rgba(247,241,232,0.92))] p-5 text-left shadow-[0_24px_80px_rgba(61,31,10,0.08)] transition hover:-translate-y-1"
                    >
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div>
                          <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-coffee-500">
                            Order ID
                          </p>
                          <p className="mt-2 font-['Cormorant_Garamond'] text-3xl font-semibold text-coffee-900">
                            #{order.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-coffee-500">
                            Date
                          </p>
                          <p className="mt-2 text-sm font-medium text-coffee-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-coffee-500">
                            Amount
                          </p>
                          <p className="mt-2 font-['Cormorant_Garamond'] text-3xl font-semibold text-coffee-900">
                            ₱{order.total.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-coffee-500">
                            Status
                          </p>
                          <span className={`inline-block mt-2 rounded-full px-3 py-1 text-xs font-semibold ${statusPill(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {order.deliveryAddress && (
                        <div className="mt-5 border-t border-[rgba(143,91,54,0.12)] pt-4">
                          <p className="text-sm text-coffee-700">{order.deliveryAddress}</p>
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
