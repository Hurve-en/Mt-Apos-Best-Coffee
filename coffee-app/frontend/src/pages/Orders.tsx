import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";
import { apiService } from "../services/api";
import { getProductImage } from "../utils/productImages";

interface ApiOrderItem {
  id: number;
  quantity: number;
  price: number;
  product?: {
    id: number;
    name: string;
    image?: string;
  };
}

interface ApiOrder {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  items: ApiOrderItem[];
}

const normalizeOrders = (input: any[]): ApiOrder[] => {
  return input.map((order, index) => {
    const normalizedItems: ApiOrderItem[] = Array.isArray(order.items)
      ? order.items.map((item: any, itemIndex: number) => ({
          id: Number(item.id ?? `${index}${itemIndex}`),
          quantity: Number(item.quantity ?? 0),
          price: Number(item.price ?? 0),
          product: item.product
            ? {
                id: Number(item.product.id ?? item.productId ?? 0),
                name: String(item.product.name ?? `Product #${item.productId ?? itemIndex + 1}`),
                image: item.product.image,
              }
            : undefined,
        }))
      : [];

    return {
      id: Number(order.id),
      status: String(order.status ?? "pending"),
      total: Number(order.total ?? order.totalPrice ?? 0),
      createdAt: String(order.createdAt ?? new Date().toISOString()),
      items: normalizedItems,
    };
  });
};

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state: any) => state.auth);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(
    location.state && (location.state as { orderPlaced?: boolean }).orderPlaced
      ? "Order placed successfully."
      : "",
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    void fetchOrders();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => setSuccess(""), 3000);
    return () => window.clearTimeout(timer);
  }, [success]);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiService.getOrders();
      setOrders(normalizeOrders(Array.isArray(data) ? data : []));
    } catch (_err) {
      setError("Failed to load your orders. Please try again.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const normalized = (status || "").toLowerCase();

    if (normalized === "pending") return "bg-yellow-100 text-yellow-800";
    if (normalized === "confirmed") return "bg-blue-100 text-blue-800";
    if (normalized === "preparing") return "bg-purple-100 text-purple-800";
    if (normalized === "ready") return "bg-green-100 text-green-800";
    if (normalized === "delivered") return "bg-emerald-200 text-emerald-900";
    if (normalized === "cancelled") return "bg-red-100 text-red-800";

    return "bg-gray-100 text-gray-800";
  };

  const visibleOrders = useMemo(
    () => [...orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [orders],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-coffee-50">
        <div className="text-center animate-fade-in-up">
          <div className="w-10 h-10 border-4 border-coffee-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-coffee-800 font-semibold">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-coffee-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-coffee-900">My Orders</h1>
          <button
            onClick={fetchOrders}
            className="btn btn-secondary btn-sm"
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl animate-fade-in">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {visibleOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-fade-in-up">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-coffee-900 mb-3">No orders yet</h2>
            <p className="text-coffee-700 mb-8">Your placed orders will appear here.</p>
            <button onClick={() => navigate("/menu")} className="btn btn-primary">
              Browse Coffee
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {visibleOrders.map((order) => (
              <article
                key={order.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 animate-fade-in-up"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-coffee-900">Order #{order.id}</h2>
                    <p className="text-sm text-coffee-700">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-3">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => {
                      const productName = item.product?.name || `Product #${item.id}`;
                      const imageSrc = getProductImage(
                        productName,
                        item.product?.image,
                        item.product?.id,
                      );

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 border border-neutral-200 rounded-xl p-3"
                        >
                          <img
                            src={imageSrc}
                            alt={productName}
                            loading="lazy"
                            sizes="64px"
                            className="w-16 h-16 rounded-lg object-cover bg-neutral-100"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-coffee-900 truncate">{productName}</p>
                            <p className="text-sm text-coffee-700">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-coffee-900">
                            ₱{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-coffee-700">No items found for this order.</p>
                  )}
                </div>

                <div className="flex justify-end pt-4 mt-4 border-t border-neutral-200">
                  <p className="text-lg font-bold text-coffee-900">
                    Total: ₱{order.total.toFixed(2)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
