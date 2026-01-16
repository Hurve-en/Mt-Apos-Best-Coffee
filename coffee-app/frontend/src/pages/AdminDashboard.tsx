import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";
import axios from "axios";

interface Stats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  recentOrders: any[];
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state: any) => state.auth);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ADMIN") {
      navigate("/admin/login");
      return;
    }
    fetchStats();
  }, [isAuthenticated, user, navigate]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/admin/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(response.data.stats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-coffee-900">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-coffee-50 to-white">
      {/* Header */}
      <div className="bg-coffee-900 text-white py-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-coffee-200">Welcome, {user?.name}!</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/admin/login");
              }}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Orders
                </p>
                <p className="text-4xl font-bold text-coffee-900 mt-2">
                  {stats?.totalOrders || 0}
                </p>
              </div>
              <div className="text-5xl">📦</div>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Products
                </p>
                <p className="text-4xl font-bold text-coffee-900 mt-2">
                  {stats?.totalProducts || 0}
                </p>
              </div>
              <div className="text-5xl">☕</div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Revenue
                </p>
                <p className="text-4xl font-bold text-coffee-700 mt-2">
                  ₱{(stats?.totalRevenue || 0).toFixed(2)}
                </p>
              </div>
              <div className="text-5xl">💰</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <button
            onClick={() => navigate("/admin/products")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <p className="text-gray-600 text-sm font-medium">Manage Products</p>
            <p className="text-2xl font-bold text-coffee-900 mt-2">
              View & Edit Products
            </p>
            <p className="text-gray-500 mt-4">
              → Add, edit, or delete coffee products
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/orders")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <p className="text-gray-600 text-sm font-medium">Manage Orders</p>
            <p className="text-2xl font-bold text-coffee-900 mt-2">
              View All Orders
            </p>
            <p className="text-gray-500 mt-4">
              → Update order status and details
            </p>
          </button>
        </div>

        {/* Recent Orders */}
        {stats?.recentOrders && stats.recentOrders.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-coffee-900 mb-6">
              Recent Orders
            </h2>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="border-l-4 border-coffee-700 bg-coffee-50 p-4 rounded"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-coffee-900">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.customer?.name} •{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-coffee-700">
                        ₱{order.totalPrice.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">{order.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
