import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/useRedux";
import { logout } from "../redux/slices/authSlice";
import axios from "axios";
import "../styles/premium.css";

interface Order {
  id: number;
  createdAt: string;
  totalPrice: number;
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
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"settings" | "orders">("settings");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Set initial form data
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }

    // Fetch orders
    fetchOrders();
  }, [isAuthenticated, navigate, user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
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
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.data.success) {
        setMessage("✓ Profile updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error: any) {
      setMessage("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <section className="section-gap bg-gradient-to-r from-amber-900 to-amber-800 text-cream">
        <div className="container">
          <h1 className="text-5xl font-bold mb-2">👤 My Profile</h1>
          <p className="text-lg opacity-90">
            Manage your account and view your orders
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-gap">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Card - Sticky Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-20 bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-6xl mb-4">☕</div>
                <h3 className="text-2xl font-bold text-brown mb-1">
                  {user?.name || "User"}
                </h3>
                <p className="text-muted text-sm mb-6">{user?.email}</p>

                <div className="border-t border-caramel border-opacity-20 pt-6 space-y-4">
                  <div className="bg-cream rounded-lg p-3">
                    <p className="text-xs text-muted mb-1">Phone</p>
                    <p className="font-bold text-brown text-sm">
                      {user?.phone || "Not set"}
                    </p>
                  </div>

                  <div className="bg-cream rounded-lg p-3">
                    <p className="text-xs text-muted mb-1">Member Since</p>
                    <p className="font-bold text-brown text-sm">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <div className="bg-cream rounded-lg p-3">
                    <p className="text-xs text-muted mb-1">Total Orders</p>
                    <p className="font-bold text-brown text-sm">
                      {orders.length}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full btn btn-secondary mt-6"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Tab Navigation */}
              <div className="flex gap-4 mb-8 border-b border-caramel border-opacity-20">
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`pb-4 px-4 font-semibold transition ${
                    activeTab === "settings"
                      ? "text-accent border-b-2 border-accent"
                      : "text-muted hover:text-brown"
                  }`}
                >
                  Account Settings
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`pb-4 px-4 font-semibold transition ${
                    activeTab === "orders"
                      ? "text-accent border-b-2 border-accent"
                      : "text-muted hover:text-brown"
                  }`}
                >
                  Order History ({orders.length})
                </button>
              </div>

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-brown mb-6">
                      Personal Information
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-brown mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-caramel rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-brown mb-2">
                          Email (Cannot change)
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full px-4 py-3 border border-caramel bg-cream text-muted rounded-lg cursor-not-allowed"
                        />
                        <p className="text-xs text-muted mt-1">
                          Email is your login credential and cannot be changed
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-brown mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+63 9XX XXX XXXX"
                          className="w-full px-4 py-3 border border-caramel rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      {message && (
                        <div
                          className={`px-4 py-3 rounded-lg ${
                            message.includes("✓")
                              ? "bg-green-50 text-green-800"
                              : "bg-red-50 text-red-800"
                          }`}
                        >
                          {message}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full"
                      >
                        {loading ? "⏳ Saving..." : "✓ Save Changes"}
                      </button>
                    </form>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-brown mb-6">
                      Default Delivery Address
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-brown mb-2">
                          Address
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Street address, building, apartment, etc."
                          rows={3}
                          className="w-full px-4 py-3 border border-caramel rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                      >
                        {loading ? "⏳ Saving..." : "✓ Update Address"}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                      <p className="text-4xl mb-4">📦</p>
                      <h3 className="text-2xl font-bold text-brown mb-2">
                        No Orders Yet
                      </h3>
                      <p className="text-muted mb-6">
                        You haven't placed any orders yet. Start shopping to see
                        your orders here!
                      </p>
                      <button
                        onClick={() => navigate("/menu")}
                        className="btn btn-primary"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-muted font-semibold uppercase mb-1">
                                Order ID
                              </p>
                              <p className="font-bold text-brown">
                                #{order.id}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted font-semibold uppercase mb-1">
                                Date
                              </p>
                              <p className="font-bold text-brown">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted font-semibold uppercase mb-1">
                                Amount
                              </p>
                              <p className="font-bold text-accent">
                                ₱{order.totalPrice.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted font-semibold uppercase mb-1">
                                Status
                              </p>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                  order.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : order.status === "cancelled"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-caramel border-opacity-20">
                            <p className="text-sm text-muted">
                              📍 {order.deliveryAddress}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
