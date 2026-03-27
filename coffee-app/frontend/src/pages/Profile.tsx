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
    return "bg-slate-100 text-slate-800";
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-coffee-50">
      <section className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-coffee-900 mb-2">
            My Profile
          </h1>
          <p className="text-coffee-700 text-base md:text-lg">
            Manage account details and review your order history.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 lg:sticky lg:top-24">
              <div className="h-14 w-14 rounded-full bg-primary-black text-white grid place-items-center text-lg font-bold mb-4">
                {user?.name?.[0] || "U"}
              </div>
              <h2 className="text-2xl font-bold text-coffee-900 leading-tight">
                {user?.name || "User"}
              </h2>
              <p className="text-coffee-700 text-sm mt-1 break-all">{user?.email}</p>

              <div className="mt-6 space-y-3">
                <div className="rounded-xl border border-neutral-200 bg-coffee-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-coffee-700">Phone</p>
                  <p className="text-sm font-medium text-coffee-900 mt-1">{user?.phone || "Not set"}</p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-coffee-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-coffee-700">Member Since</p>
                  <p className="text-sm font-medium text-coffee-900 mt-1">{memberSince}</p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-coffee-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-coffee-700">Total Orders</p>
                  <p className="text-sm font-medium text-coffee-900 mt-1">{orders.length}</p>
                </div>
              </div>

              <button onClick={handleLogout} className="btn btn-secondary w-full mt-6">
                Logout
              </button>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="border-b border-neutral-200 mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition ${
                    activeTab === "settings"
                      ? "bg-white border-x border-t border-neutral-200 text-coffee-900"
                      : "text-coffee-700 hover:text-coffee-900"
                  }`}
                >
                  Account Settings
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition ${
                    activeTab === "orders"
                      ? "bg-white border-x border-t border-neutral-200 text-coffee-900"
                      : "text-coffee-700 hover:text-coffee-900"
                  }`}
                >
                  Order History ({orders.length})
                </button>
              </div>
            </div>

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-coffee-900 mb-6">Personal Information</h3>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-coffee-900 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-coffee-900 placeholder:text-coffee-500 focus:outline-none focus:ring-2 focus:ring-primary-black focus:border-primary-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-coffee-900 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 border border-neutral-300 bg-coffee-50 text-coffee-700 rounded-lg cursor-not-allowed"
                      />
                      <p className="text-xs text-coffee-700 mt-1">Email cannot be changed.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-coffee-900 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+63 9XX XXX XXXX"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-coffee-900 placeholder:text-coffee-500 focus:outline-none focus:ring-2 focus:ring-primary-black focus:border-primary-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-coffee-900 mb-2">Default Delivery Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Street address, building, apartment, etc."
                        rows={3}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-coffee-900 placeholder:text-coffee-500 focus:outline-none focus:ring-2 focus:ring-primary-black focus:border-primary-black"
                      />
                    </div>

                    {message && (
                      <div
                        className={`px-4 py-3 rounded-lg text-sm font-medium ${
                          message.type === "success"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                      >
                        {message.text}
                      </div>
                    )}

                    <div className="flex gap-3">
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
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-10 text-center">
                    <h3 className="text-2xl font-bold text-coffee-900 mb-2">No Orders Yet</h3>
                    <p className="text-coffee-700 mb-6">
                      You haven&apos;t placed any orders yet.
                    </p>
                    <button onClick={() => navigate("/menu")} className="btn btn-primary">
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  orders.map((order) => (
                    <button
                      key={order.id}
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="w-full text-left bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition p-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-coffee-700">Order ID</p>
                          <p className="text-coffee-900 font-bold mt-1">#{order.id}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-coffee-700">Date</p>
                          <p className="text-coffee-900 font-medium mt-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-coffee-700">Amount</p>
                          <p className="text-coffee-900 font-bold mt-1">₱{order.total.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-coffee-700">Status</p>
                          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${statusPill(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {order.deliveryAddress && (
                        <div className="mt-4 pt-4 border-t border-neutral-200">
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
