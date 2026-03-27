import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../components/Admin/AdminLayout";
import "../styles/premium.css";

interface OrderItem {
  id: number;
  productId: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    size: string;
    roastLevel: string;
  };
}

interface Order {
  id: number;
  userId: number;
  status: string;
  total: number;
  deliveryAddress: string;
  orderItems?: OrderItem[];
  createdAt: string;
  user?: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    void fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const url = statusFilter
        ? `http://localhost:3000/api/admin/orders?status=${statusFilter}`
        : "http://localhost:3000/api/admin/orders";
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const nextOrders = response.data.data || response.data;
      setOrders(nextOrders);
      if (nextOrders.length > 0 && !selectedOrder) {
        setSelectedOrder(nextOrders[0]);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdating(true);
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? response.data.data : order)),
      );
      setSelectedOrder(response.data.data);
    } catch (_err) {
      alert("Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "bg-amber-100 text-amber-900",
      confirmed: "bg-sky-100 text-sky-900",
      preparing: "bg-violet-100 text-violet-900",
      ready: "bg-emerald-100 text-emerald-900",
      delivered: "bg-emerald-200 text-emerald-900",
      cancelled: "bg-red-100 text-red-800",
    };
    return statusMap[status.toLowerCase()] || "bg-stone-100 text-stone-800";
  };

  if (loading) {
    return (
      <AdminLayout title="Orders" subtitle="Loading orders...">
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">☕</div>
            <p className="text-lg text-coffee-700">Please wait</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Manage Orders"
      subtitle="Review every order, keep status updates clear, and stay close to the customer journey."
    >
      <div className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
          <div className="rounded-[2rem] border border-[rgba(143,91,54,0.14)] bg-[linear-gradient(180deg,rgba(255,251,245,0.95),rgba(247,241,232,0.92))] p-7 shadow-[0_24px_80px_rgba(61,31,10,0.08)]">
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-coffee-500">
              Order Flow
            </p>
            <h3 className="mt-3 font-['Cormorant_Garamond'] text-4xl font-semibold text-coffee-900">
              Keep service calm and timely.
            </h3>
            <p className="mt-3 text-sm leading-7 text-coffee-700">
              Filter incoming orders, review customer information, and move
              every order through the workflow with confidence.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[rgba(143,91,54,0.14)] bg-white/85 p-7 shadow-[0_24px_80px_rgba(61,31,10,0.08)]">
            <label className="block text-[0.72rem] uppercase tracking-[0.22em] text-coffee-500">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-4 w-full rounded-[1rem] border border-[rgba(143,91,54,0.16)] bg-white/90 px-4 py-3 text-coffee-900 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
            >
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="rounded-[2rem] border border-[rgba(143,91,54,0.14)] bg-[linear-gradient(180deg,rgba(255,251,245,0.95),rgba(247,241,232,0.92))] p-12 text-center shadow-[0_24px_80px_rgba(61,31,10,0.08)]">
                <h3 className="font-['Cormorant_Garamond'] text-4xl font-semibold text-coffee-900">
                  No Orders Found
                </h3>
                <p className="mt-3 text-sm text-coffee-700">
                  No orders match your current filter.
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`w-full rounded-[1.75rem] border p-6 text-left shadow-[0_24px_80px_rgba(61,31,10,0.08)] transition hover:-translate-y-1 ${
                    selectedOrder?.id === order.id
                      ? "border-coffee-500 bg-[#fffaf3]"
                      : "border-[rgba(143,91,54,0.14)] bg-[linear-gradient(180deg,rgba(255,251,245,0.95),rgba(247,241,232,0.92))]"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-coffee-500">
                        Order Reference
                      </p>
                      <h3 className="mt-2 font-['Cormorant_Garamond'] text-4xl font-semibold leading-none text-coffee-900">
                        #{String(order.id).padStart(4, "0")}
                      </h3>
                      <p className="mt-3 text-sm text-coffee-700">
                        {order.user?.name || "Unknown customer"} •{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${getStatusBadge(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-5 flex items-end justify-between border-t border-[rgba(143,91,54,0.12)] pt-4">
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-coffee-500">
                        Items
                      </p>
                      <p className="mt-2 text-sm text-coffee-900">
                        {order.orderItems?.length || 0} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-coffee-500">
                        Total
                      </p>
                      <p className="mt-2 font-['Cormorant_Garamond'] text-4xl font-semibold leading-none text-coffee-900">
                        ₱{order.total}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {selectedOrder && (
            <aside className="h-fit rounded-[2rem] border border-[rgba(143,91,54,0.14)] bg-[linear-gradient(180deg,rgba(255,251,245,0.95),rgba(247,241,232,0.92))] p-7 shadow-[0_24px_80px_rgba(61,31,10,0.08)] xl:sticky xl:top-28">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-coffee-500">
                Selected Order
              </p>
              <h2 className="mt-3 font-['Cormorant_Garamond'] text-5xl font-semibold leading-none text-coffee-900">
                #{String(selectedOrder.id).padStart(4, "0")}
              </h2>

              <div className="mt-7 space-y-6">
                <section className="rounded-[1.5rem] border border-[rgba(143,91,54,0.12)] bg-white/75 p-5">
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-coffee-500">
                    Customer
                  </p>
                  <p className="mt-3 text-sm font-medium text-coffee-900">
                    {selectedOrder.user?.name}
                  </p>
                  <p className="mt-1 text-sm text-coffee-700">
                    {selectedOrder.user?.email}
                  </p>
                  <p className="mt-1 text-sm text-coffee-700">
                    {selectedOrder.user?.phone}
                  </p>
                </section>

                <section className="rounded-[1.5rem] border border-[rgba(143,91,54,0.12)] bg-white/75 p-5">
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-coffee-500">
                    Items
                  </p>
                  <div className="mt-4 space-y-3">
                    {selectedOrder.orderItems?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between gap-4 rounded-[1rem] bg-[#f8f0e4] px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-coffee-900">
                            {item.product?.name}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-coffee-500">
                            x{item.quantity}
                          </p>
                        </div>
                        <p className="font-['Cormorant_Garamond'] text-2xl font-semibold leading-none text-coffee-900">
                          ₱{(item.price * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[1.5rem] border border-[rgba(143,91,54,0.12)] bg-white/75 p-5">
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-coffee-500">
                    Delivery Address
                  </p>
                  <p className="mt-3 text-sm leading-7 text-coffee-700">
                    {selectedOrder.deliveryAddress}
                  </p>
                </section>

                <section className="rounded-[1.5rem] border border-[rgba(143,91,54,0.12)] bg-white/75 p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-coffee-500">
                        Total
                      </p>
                      <p className="mt-3 font-['Cormorant_Garamond'] text-5xl font-semibold leading-none text-coffee-900">
                        ₱{selectedOrder.total}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${getStatusBadge(selectedOrder.status)}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                </section>

                <div>
                  <label className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700">
                    Update Status
                  </label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleStatusChange(selectedOrder.id, e.target.value)
                    }
                    disabled={updating}
                    className="w-full rounded-[1rem] border border-[rgba(143,91,54,0.16)] bg-white/90 px-4 py-3 text-coffee-900 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
