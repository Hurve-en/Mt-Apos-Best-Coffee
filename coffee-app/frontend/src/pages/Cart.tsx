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

  // Derive item count and totals
  const itemsCount = items.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0,
  );
  const deliveryFee = totalPrice > 0 ? (totalPrice >= 500 ? 0 : 50) : 0;
  const finalTotal = totalPrice + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#faf7f0_0%,#f4ede2_100%)]">
        <div className="max-w-md text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.28em] text-coffee-500">
            Basket Review
          </div>
          <h1 className="mb-4 font-['Cormorant_Garamond'] text-6xl font-semibold leading-none text-coffee-900">
            Your cart is empty
          </h1>
          <p className="text-coffee-700 text-lg mb-8">
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
    <div className="min-h-screen bg-[linear-gradient(180deg,#faf7f0_0%,#f5efe5_100%)]">
      <section className="section-gap border-b border-[rgba(143,91,54,0.12)] bg-transparent">
        <div className="container">
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-coffee-500">
            Curated Checkout
          </p>
          <h1 className="mb-2 font-['Cormorant_Garamond'] text-6xl font-semibold leading-none text-coffee-900">
            Cart
          </h1>
          <p className="text-lg text-coffee-700">
            {itemsCount} item{itemsCount !== 1 ? "s" : ""} in your cart
          </p>
        </div>
      </section>

      <section className="section-gap">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item: any) => (
                  <div
                    key={item.productId}
                    className="flex flex-col items-start justify-between gap-4 rounded-[28px] border border-[rgba(143,91,54,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(250,249,245,0.92))] p-6 shadow-[0_18px_45px_rgba(61,31,10,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(61,31,10,0.12)] sm:flex-row sm:items-center"
                  >
                    <div className="flex-1">
                      <h3 className="mb-2 font-['Cormorant_Garamond'] text-[2rem] font-semibold leading-none text-coffee-900">
                        {item.name || "Product"}
                      </h3>
                      <div className="flex flex-wrap gap-3 mb-3">
                        {item.roastLevel && (
                          <span className="text-xs bg-coffee-200 bg-opacity-20 text-coffee-900 px-3 py-1 rounded-full font-semibold">
                            {item.roastLevel} Roast
                          </span>
                        )}
                        {item.grind && (
                          <span className="text-xs bg-gray-500 bg-opacity-20 text-coffee-900 px-3 py-1 rounded-full font-semibold">
                            {item.grind}
                          </span>
                        )}
                        {item.size && (
                          <span className="text-xs bg-coffee-200 bg-opacity-20 text-coffee-900 px-3 py-1 rounded-full font-semibold">
                            {item.size}
                          </span>
                        )}
                      </div>
                      <p className="text-coffee-700">
                        ₱{item.price.toFixed(2)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center rounded-2xl border border-[rgba(143,91,54,0.16)] bg-white/80">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.quantity - 1,
                            )
                          }
                          className="px-3 py-2 text-coffee-900 font-bold hover:bg-coffee-200 hover:bg-opacity-20 transition rounded-l-lg"
                        >
                          −
                        </button>
                        <span className="px-4 font-bold text-coffee-900 min-w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.quantity + 1,
                            )
                          }
                          className="px-3 py-2 text-coffee-900 font-bold hover:bg-coffee-200 hover:bg-opacity-20 transition rounded-r-lg"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right min-w-24">
                        <p className="text-sm text-coffee-700 mb-1">Subtotal</p>
                        <p className="text-2xl font-bold text-coffee-900">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => dispatch(removeFromCart(item.productId))}
                        className="px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg font-bold transition"
                        title="Remove from cart"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20 rounded-[32px] border border-[rgba(143,91,54,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(250,249,245,0.92))] p-8 shadow-[0_18px_45px_rgba(61,31,10,0.08)]">
                <h2 className="mb-6 font-['Cormorant_Garamond'] text-4xl font-semibold leading-none text-coffee-900">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b-2 border-neutral-300 border-opacity-20">
                  <div className="flex justify-between items-center">
                    <span className="text-coffee-700">
                      Subtotal ({itemsCount} items)
                    </span>
                    <span className="font-bold text-coffee-900">
                      ₱{totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-coffee-700">
                      Delivery Fee{" "}
                      {deliveryFee === 0 && (
                        <span className="text-xs text-green-600 font-semibold">
                          (FREE)
                        </span>
                      )}
                    </span>
                    <span
                      className={`font-bold ${deliveryFee === 0 ? "text-green-600" : "text-coffee-900"}`}
                    >
                      ₱{deliveryFee.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-coffee-900">Total</span>
                    <span className="text-3xl font-bold text-accent">
                      ₱{finalTotal.toFixed(2)}
                    </span>
                  </div>
                  {deliveryFee === 0 && (
                    <p className="text-xs text-green-600 font-semibold mt-2 text-center">
                      Done Free delivery on orders ₱500+
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
