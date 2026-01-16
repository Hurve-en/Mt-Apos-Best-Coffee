import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";
import axios from "axios";

interface Order {
  id: string;
  customerId: string;
  status: string;
  totalPrice: number;
  deliveryAddress: string;
  items: any[];
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

const AdminOrders: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state: any) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ADMIN") {
      navigate("/admin/login");
      return;
    }
    fetchOrders();
  }, [isAuthenticated, user, navigate, statusFilter]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = statusFilter
        ? `http://localhost:5000/api/admin/orders?status=${statusFilter}`
        : "http://localhost:5000/api/admin/orders";
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const token = localStorage.getItem("token");
    setUpdating(true);

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(
        orders.map((o) => (o.id === orderId ? response.data.order : o))
      );
      setSelectedOrder(response.data.order);
      alert("Order status updated!");
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "PREPARING":
        return "bg-purple-100 text-purple-800";
      case "READY":
        return "bg-green-100 text-green-800";
      case "DELIVERED":
        return "bg-green-200 text-green-900";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-coffee-900">Loading orders...</div>
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
              <h1 className="text-3xl font-bold">Orders Management</h1>
              <p className="text-coffee-200">Manage all customer orders</p>
            </div>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="px-4 py-2 bg-coffee-800 rounded-lg hover:bg-coffee-700 transition"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Status Filter */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
          >
            <option value="">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY">Ready</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`bg-white rounded-lg shadow p-6 cursor-pointer transition hover:shadow-lg ${
                    selectedOrder?.id === order.id
                      ? "ring-2 ring-coffee-500"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-coffee-900">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.customer?.name} •{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        {order.items?.length || 0} items
                      </p>
                      <p className="font-bold text-coffee-700 mt-1">
                        ₱{order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-2xl">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          {selectedOrder && (
            <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-24">
              <h2 className="text-2xl font-bold text-coffee-900 mb-6">
                Order Details
              </h2>

              {/* Customer Info */}
              <div className="mb-6 pb-6 border-b-2 border-coffee-200">
                <h3 className="font-bold text-coffee-900 mb-2">Customer</h3>
                <p className="text-sm">{selectedOrder.customer?.name}</p>
                <p className="text-sm text-gray-600">
                  {selectedOrder.customer?.email}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedOrder.customer?.phone}
                </p>
              </div>

              {/* Items */}
              <div className="mb-6 pb-6 border-b-2 border-coffee-200">
                <h3 className="font-bold text-coffee-900 mb-2">Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>Product × {item.quantity}</span>
                      <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-6 pb-6 border-b-2 border-coffee-200">
                <h3 className="font-bold text-coffee-900 mb-2">
                  Delivery Address
                </h3>
                <p className="text-sm text-gray-700">
                  {selectedOrder.deliveryAddress}
                </p>
              </div>

              {/* Total */}
              <div className="mb-6 pb-6 border-b-2 border-coffee-200">
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-coffee-700">
                    ₱{selectedOrder.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder.id, e.target.value)
                  }
                  disabled={updating}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PREPARING">Preparing</option>
                  <option value="READY">Ready</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
