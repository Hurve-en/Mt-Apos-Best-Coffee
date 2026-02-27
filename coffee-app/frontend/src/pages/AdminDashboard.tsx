import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/useRedux";
import { logout } from "../redux/slices/authSlice";
import axios from "axios";
import "../styles/premium.css";

interface Stats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state: any) => state.auth);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/admin-login");
      return;
    }
    fetchStats();
  }, [isAuthenticated, user, navigate]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/admin/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">☕</div>
          <p className="text-2xl text-black font-semibold">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gray-800 text-white sticky top-0 z-40 shadow-lg">
        <div className="container py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">📊 Admin Dashboard</h1>
              <p className="text-lg opacity-90">Welcome back, {user?.name}!</p>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="section-gap">
        <div className="container">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Total Orders */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-coffee-700 uppercase tracking-wide">
                    Total Orders
                  </p>
                  <p className="text-5xl font-bold text-accent mt-3">
                    {stats?.totalOrders || 0}
                  </p>
                </div>
                <div className="text-6xl opacity-20">📦</div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-300 border-opacity-20">
                <p className="text-xs text-coffee-700">View all orders</p>
              </div>
            </div>

            {/* Total Products */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-coffee-700 uppercase tracking-wide">
                    Total Products
                  </p>
                  <p className="text-5xl font-bold text-accent mt-3">
                    {stats?.totalProducts || 0}
                  </p>
                </div>
                <div className="text-6xl opacity-20">☕</div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-300 border-opacity-20">
                <p className="text-xs text-coffee-700">Manage inventory</p>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-coffee-700 uppercase tracking-wide">
                    Total Revenue
                  </p>
                  <p className="text-5xl font-bold text-accent mt-3">
                    ₱
                    {(stats?.totalRevenue || 0).toLocaleString("en-PH", {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
                <div className="text-6xl opacity-20">💰</div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-300 border-opacity-20">
                <p className="text-xs text-coffee-700">All-time earnings</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <button
              onClick={() => navigate("/admin/products")}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition text-left group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl group-hover:scale-110 transition">
                  📝
                </div>
                <span className="text-accent font-bold group-hover:translate-x-2 transition">
                  →
                </span>
              </div>
              <p className="text-sm font-semibold text-coffee-700 uppercase tracking-wide mb-2">
                Management
              </p>
              <h3 className="text-2xl font-bold text-black mb-3">
                Manage Products
              </h3>
              <p className="text-coffee-700">
                Add, edit, or delete coffee products from your inventory
              </p>
            </button>

            <button
              onClick={() => navigate("/admin/orders")}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition text-left group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl group-hover:scale-110 transition">
                  📦
                </div>
                <span className="text-accent font-bold group-hover:translate-x-2 transition">
                  →
                </span>
              </div>
              <p className="text-sm font-semibold text-coffee-700 uppercase tracking-wide mb-2">
                Management
              </p>
              <h3 className="text-2xl font-bold text-black mb-3">
                Manage Orders
              </h3>
              <p className="text-coffee-700">
                View and update order status, and manage customer requests
              </p>
            </button>
          </div>

          {/* Recent Orders */}
          {stats?.recentOrders && stats.recentOrders.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-black mb-8">
                Recent Orders
              </h2>
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border-l-4 border-accent bg-gradient-to-r from-cream to-transparent p-6 rounded-lg hover:shadow-md transition cursor-pointer"
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                  >
                    <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
                      <div>
                        <p className="font-bold text-black text-lg">
                          Order #{order.id}
                        </p>
                        <p className="text-sm text-coffee-700 mt-1">
                          {order.customer?.name || "Unknown"} •{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-accent text-xl">
                          ₱{order.totalPrice.toFixed(2)}
                        </p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <p className="text-5xl mb-4">📭</p>
              <h3 className="text-2xl font-bold text-black mb-2">
                No Orders Yet
              </h3>
              <p className="text-coffee-700 mb-6">
                Start processing orders to see them here
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
