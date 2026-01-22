import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import {
  removeFromCart,
  updateCartItem,
  clearCart,
} from "../redux/slices/cartSlice";
import "../styles/premium.css";

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state: any) => state.auth);
  const { items, totalPrice } = useAppSelector((state: any) => state.cart);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert("Please login to checkout");
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      dispatch(updateCartItem({ productId, quantity: newQuantity }));
    }
  };

  // Calculate items count and subtotal
  const itemsCount = items.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0,
  );
  const deliveryFee = totalPrice > 0 ? (totalPrice >= 500 ? 0 : 50) : 0;
  const finalTotal = totalPrice + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6 opacity-50">🛒</div>
          <h1 className="text-4xl font-bold text-brown mb-4">
            Your cart is empty
          </h1>
          <p className="text-muted text-lg mb-8">
            Discover our premium Mt. Apo coffee and start building your perfect
            order
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="btn btn-primary btn-lg w-full mb-4"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/")}
            className="btn btn-secondary btn-lg w-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <section className="section-gap bg-gradient-to-r from-amber-900 to-amber-800 text-cream">
        <div className="container">
          <h1 className="text-5xl font-bold mb-2">🛒 Shopping Cart</h1>
          <p className="text-lg opacity-90">
            {itemsCount} item{itemsCount !== 1 ? "s" : ""} in your cart
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-gap">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item: any) => (
                  <div
                    key={item.productId}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-brown mb-2">
                        {item.name || "Product"}
                      </h3>
                      <div className="flex flex-wrap gap-3 mb-3">
                        {item.roastLevel && (
                          <span className="text-xs bg-caramel bg-opacity-20 text-brown px-3 py-1 rounded-full font-semibold">
                            {item.roastLevel} Roast
                          </span>
                        )}
                        {item.grind && (
                          <span className="text-xs bg-sage-green bg-opacity-20 text-brown px-3 py-1 rounded-full font-semibold">
                            {item.grind}
                          </span>
                        )}
                        {item.size && (
                          <span className="text-xs bg-caramel bg-opacity-20 text-brown px-3 py-1 rounded-full font-semibold">
                            {item.size}
                          </span>
                        )}
                      </div>
                      <p className="text-muted">
                        ₱{item.price.toFixed(2)} each
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-cream rounded-lg border-2 border-caramel border-opacity-30">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.quantity - 1,
                            )
                          }
                          className="px-3 py-2 text-brown font-bold hover:bg-caramel hover:bg-opacity-20 transition rounded-l-lg"
                        >
                          −
                        </button>
                        <span className="px-4 font-bold text-brown min-w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.quantity + 1,
                            )
                          }
                          className="px-3 py-2 text-brown font-bold hover:bg-caramel hover:bg-opacity-20 transition rounded-r-lg"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-24">
                        <p className="text-sm text-muted mb-1">Subtotal</p>
                        <p className="text-2xl font-bold text-brown">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => dispatch(removeFromCart(item.productId))}
                        className="px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg font-bold transition"
                        title="Remove from cart"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-brown mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b-2 border-caramel border-opacity-20">
                  <div className="flex justify-between items-center">
                    <span className="text-muted">
                      Subtotal ({itemsCount} items)
                    </span>
                    <span className="font-bold text-brown">
                      ₱{totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">
                      Delivery Fee{" "}
                      {deliveryFee === 0 && (
                        <span className="text-xs text-green-600 font-semibold">
                          (FREE)
                        </span>
                      )}
                    </span>
                    <span
                      className={`font-bold ${deliveryFee === 0 ? "text-green-600" : "text-brown"}`}
                    >
                      ₱{deliveryFee.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-brown">Total</span>
                    <span className="text-3xl font-bold text-accent">
                      ₱{finalTotal.toFixed(2)}
                    </span>
                  </div>
                  {deliveryFee === 0 && (
                    <p className="text-xs text-green-600 font-semibold mt-2 text-center">
                      ✓ Free delivery on orders ₱500+
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCheckout}
                  className="btn btn-primary btn-lg w-full mb-3"
                >
                  Proceed to Checkout →
                </button>

                <button
                  onClick={() => navigate("/menu")}
                  className="btn btn-secondary btn-lg w-full mb-3"
                >
                  Continue Shopping
                </button>

                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to clear your cart?",
                      )
                    ) {
                      dispatch(clearCart());
                    }
                  }}
                  className="w-full py-3 text-red-600 hover:bg-red-100 rounded-lg font-bold transition border-2 border-red-200"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
