import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { clearCart } from "../redux/slices/cartSlice";
import axios from "axios";
import { apiService } from "../services/api";
import L from "leaflet";
import "../styles/premium.css";
import "leaflet/dist/leaflet.css";

type CheckoutStep = "delivery" | "payment" | "review";

interface LocationSuggestion {
  name: string;
  lat: number;
  lon: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state: any) => state.auth);
  const { items, totalPrice } = useAppSelector((state: any) => state.cart);

  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "Cebu",
    postalCode: "",
    latitude: 10.3157,
    longitude: 123.8854,

    paymentMethod: "cash",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
  });

  const deliveryFee = totalPrice >= 500 ? 0 : 50;
  const finalTotal = totalPrice + deliveryFee;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      navigate("/cart");
    }
  }, [isAuthenticated, items.length, navigate]);

  useEffect(() => {
    if (
      currentStep === "delivery" &&
      !mapInitialized &&
      mapRef.current === null
    ) {
      initializeMap();
      return;
    }

    if (currentStep === "delivery" && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 120);
    }
  }, [currentStep, mapInitialized]);

  const initializeMap = () => {
    const container = document.getElementById("checkout-map");
    if (!container) return;

    const map = L.map("checkout-map").setView(
      [formData.latitude, formData.longitude],
      14,
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([formData.latitude, formData.longitude], {
      icon: L.icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      }),
    }).addTo(map);

    marker.bindPopup("Your delivery location");
    markerRef.current = marker;
    mapRef.current = map;
    setMapInitialized(true);

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      updateMapMarker(lat, lng);
      reverseGeocode(lat, lng);
    });
  };

  const updateMapMarker = (lat: number, lng: number) => {
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }

    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 14);
    }

    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const searchLocation = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
      );

      const locationSuggestions = response.data
        .slice(0, 5)
        .map((result: any) => ({
          name: result.display_name,
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
        }));

      setSuggestions(locationSuggestions);
      setShowSuggestions(locationSuggestions.length > 0);
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );

      setFormData((prev) => ({
        ...prev,
        address:
          response.data.address?.road || response.data.address?.village || "",
      }));
    } catch {
      // best-effort reverse geocode; input field remains editable
    }
  };

  const selectSuggestion = (suggestion: LocationSuggestion) => {
    setFormData((prev) => ({
      ...prev,
      address: suggestion.name,
      latitude: suggestion.lat,
      longitude: suggestion.lon,
    }));

    updateMapMarker(suggestion.lat, suggestion.lon);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "address") {
      searchLocation(value);
    }
  };

  const validateDeliveryInfo = () => {
    if (
      !formData.fullName.trim() ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      setError("Please complete all required delivery details.");
      return false;
    }

    setError("");
    return true;
  };

  const validatePaymentInfo = () => {
    if (formData.paymentMethod === "card") {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCVV) {
        setError("Please complete your card details.");
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === "delivery" && validateDeliveryInfo()) {
      setCurrentStep("payment");
    } else if (currentStep === "payment" && validatePaymentInfo()) {
      setCurrentStep("review");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === "payment") {
      setCurrentStep("delivery");
    } else if (currentStep === "review") {
      setCurrentStep("payment");
    }
  };

  const handleSubmitOrder = async () => {
    setLoading(true);

    try {
      await apiService.createOrder({
        deliveryAddress: `${formData.address}, ${formData.city} ${formData.postalCode}`,
        totalPrice: finalTotal,
        items: items.map((item: any) => ({
          productId: String(item.productId),
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
      });

      dispatch(clearCart());
      navigate("/orders", { state: { orderPlaced: true } });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  const steps: Array<{ key: CheckoutStep; title: string }> = [
    { key: "delivery", title: "Delivery" },
    { key: "payment", title: "Payment" },
    { key: "review", title: "Review" },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

  if (!isAuthenticated || items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-coffee-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-coffee-200 bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-coffee-900">
            Checkout unavailable
          </h1>
          <p className="mt-2 text-sm text-coffee-600">
            Add items to your cart first, then return to checkout.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="mt-6 w-full rounded-xl bg-coffee-800 px-4 py-3 font-semibold text-white transition hover:bg-coffee-900"
          >
            Back to menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-coffee-50 via-white to-coffee-100 px-4 py-8 sm:py-10">
      <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-coffee-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-coffee-300/30 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl">
        <header className="mb-6 rounded-3xl border border-coffee-200 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
          <h1 className="mb-2 text-3xl font-bold text-coffee-900 sm:text-4xl">
            Checkout
          </h1>
          <p className="text-sm text-coffee-600 sm:text-base">
            Complete your delivery details, payment, and final review.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {steps.map((step, index) => {
              const isActive = currentStep === step.key;
              const isComplete = currentStepIndex > index;

              return (
                <div
                  key={step.key}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
                    isActive
                      ? "border-coffee-400 bg-coffee-100"
                      : isComplete
                        ? "border-green-300 bg-green-50"
                        : "border-coffee-200 bg-white"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      isActive
                        ? "bg-coffee-800 text-white"
                        : isComplete
                          ? "bg-green-600 text-white"
                          : "bg-coffee-100 text-coffee-700"
                    }`}
                  >
                    {isComplete ? "✓" : index + 1}
                  </div>
                  <span className="font-semibold text-coffee-900">{step.title}</span>
                </div>
              );
            })}
          </div>
        </header>

        {error && (
          <div
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <div className="rounded-3xl border border-coffee-200 bg-white p-6 shadow-lg sm:p-8">
              {currentStep === "delivery" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-coffee-900">
                      Delivery information
                    </h2>
                    <p className="mt-1 text-sm text-coffee-600">
                      Tell us where to deliver your order.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-coffee-900">
                        Full name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className="w-full rounded-xl border border-coffee-200 px-4 py-3 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-coffee-900">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-coffee-200 px-4 py-3 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-coffee-900">
                      Phone number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+63 9XX XXX XXXX"
                      className="w-full rounded-xl border border-coffee-200 px-4 py-3 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-coffee-900">
                      Pin your location on the map
                    </label>
                    <div
                      id="checkout-map"
                      className="h-80 w-full overflow-hidden rounded-2xl border-2 border-coffee-200 md:h-96"
                    />
                  </div>

                  <div className="relative">
                    <label className="mb-2 block text-sm font-semibold text-coffee-900">
                      Delivery address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Search or type your address"
                      className="w-full rounded-xl border border-coffee-200 px-4 py-3 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                    />

                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-coffee-200 bg-white shadow-lg">
                        {suggestions.map((suggestion, idx) => (
                          <button
                            key={`${suggestion.lat}-${suggestion.lon}-${idx}`}
                            onClick={() => selectSuggestion(suggestion)}
                            type="button"
                            className="w-full border-b border-coffee-100 px-4 py-3 text-left text-sm text-coffee-800 transition hover:bg-coffee-50 last:border-b-0"
                          >
                            {suggestion.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-coffee-900">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-coffee-200 px-4 py-3 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-coffee-900">
                        Postal code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="6000"
                        className="w-full rounded-xl border border-coffee-200 px-4 py-3 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "payment" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-coffee-900">
                      Payment method
                    </h2>
                    <p className="mt-1 text-sm text-coffee-600">
                      Choose how you want to pay for this order.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${
                        formData.paymentMethod === "cash"
                          ? "border-coffee-500 bg-coffee-50"
                          : "border-coffee-200 hover:bg-coffee-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === "cash"}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                      />
                      <span className="font-semibold text-coffee-900">
                        Cash on Delivery (COD)
                      </span>
                      <span className="ml-auto text-xs text-coffee-600 sm:text-sm">
                        Pay when your order arrives
                      </span>
                    </label>

                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${
                        formData.paymentMethod === "card"
                          ? "border-coffee-500 bg-coffee-50"
                          : "border-coffee-200 hover:bg-coffee-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                      />
                      <span className="font-semibold text-coffee-900">
                        Credit / Debit Card
                      </span>
                    </label>
                  </div>

                  {formData.paymentMethod === "card" && (
                    <div className="space-y-4 rounded-2xl border border-coffee-200 bg-coffee-50/40 p-5">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-coffee-900">
                          Card number *
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\s/g, "");
                            value = value.replace(/(\d{4})/g, "$1 ").trim();
                            setFormData((prev) => ({
                              ...prev,
                              cardNumber: value,
                            }));
                          }}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full rounded-xl border border-coffee-200 px-4 py-3 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-coffee-900">
                            Expiry (MM/YY) *
                          </label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, "");
                              if (value.length >= 2) {
                                value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
                              }
                              setFormData((prev) => ({
                                ...prev,
                                cardExpiry: value,
                              }));
                            }}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full rounded-xl border border-coffee-200 px-4 py-3 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-coffee-900">
                            CVV *
                          </label>
                          <input
                            type="text"
                            name="cardCVV"
                            value={formData.cardCVV}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              if (value.length <= 4) {
                                setFormData((prev) => ({
                                  ...prev,
                                  cardCVV: value,
                                }));
                              }
                            }}
                            placeholder="123"
                            maxLength={4}
                            className="w-full rounded-xl border border-coffee-200 px-4 py-3 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === "review" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-coffee-900">
                      Review your order
                    </h2>
                    <p className="mt-1 text-sm text-coffee-600">
                      Confirm everything before placing your order.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-coffee-200 bg-coffee-50/40 p-5">
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-coffee-700">
                      Delivery details
                    </h3>
                    <div className="space-y-2 text-sm text-coffee-800">
                      <p>
                        <span className="font-semibold text-coffee-900">Name:</span>{" "}
                        {formData.fullName}
                      </p>
                      <p>
                        <span className="font-semibold text-coffee-900">Email:</span>{" "}
                        {formData.email}
                      </p>
                      <p>
                        <span className="font-semibold text-coffee-900">Phone:</span>{" "}
                        {formData.phone}
                      </p>
                      <p>
                        <span className="font-semibold text-coffee-900">Address:</span>{" "}
                        {formData.address}, {formData.city} {formData.postalCode}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-coffee-200 bg-coffee-50/40 p-5">
                    <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.14em] text-coffee-700">
                      Payment
                    </h3>
                    <p className="text-sm text-coffee-800">
                      {formData.paymentMethod === "cash"
                        ? "Cash on Delivery (COD)"
                        : "Credit / Debit Card"}
                    </p>
                  </div>

                  <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    Everything looks good. Place your order when ready.
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {currentStep !== "delivery" && (
                  <button
                    onClick={handlePreviousStep}
                    className="w-full rounded-xl border border-coffee-300 bg-white px-4 py-3 font-semibold text-coffee-900 transition hover:bg-coffee-50 sm:w-auto"
                  >
                    Back
                  </button>
                )}

                {currentStep !== "review" && (
                  <button
                    onClick={handleNextStep}
                    className="w-full rounded-xl bg-coffee-800 px-4 py-3 font-semibold text-white transition hover:bg-coffee-900"
                  >
                    {currentStep === "delivery"
                      ? "Continue to payment"
                      : "Continue to review"}
                  </button>
                )}

                {currentStep === "review" && (
                  <button
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="w-full rounded-xl bg-coffee-800 px-4 py-3 font-semibold text-white transition hover:bg-coffee-900 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Placing order..." : "Place order"}
                  </button>
                )}
              </div>
            </div>
          </section>

          <aside className="lg:col-span-1">
            <div className="sticky top-20 rounded-3xl border border-coffee-200 bg-white p-6 shadow-lg">
              <h3 className="mb-5 text-xl font-bold text-coffee-900">Order summary</h3>

              <div className="mb-6 max-h-64 space-y-2 overflow-y-auto pr-1">
                {items.map((item: any) => (
                  <div
                    key={item.productId}
                    className="flex items-start justify-between border-b border-coffee-100 py-2 text-sm"
                  >
                    <span className="pr-3 text-coffee-800">
                      {item.name} x <span className="font-semibold">{item.quantity}</span>
                    </span>
                    <span className="font-semibold text-coffee-900">
                      PHP {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-coffee-200 pt-4 text-sm">
                <div className="flex justify-between text-coffee-700">
                  <span>Subtotal</span>
                  <span className="font-semibold text-coffee-900">
                    PHP {totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-coffee-700">
                  <span>Delivery fee</span>
                  <span
                    className={`font-semibold ${deliveryFee === 0 ? "text-green-600" : "text-coffee-900"}`}
                  >
                    PHP {deliveryFee.toFixed(2)}
                    {deliveryFee === 0 ? " (FREE)" : ""}
                  </span>
                </div>
                <div className="flex justify-between border-t border-coffee-200 pt-3 text-base">
                  <span className="font-bold text-coffee-900">Total</span>
                  <span className="font-bold text-coffee-900">
                    PHP {finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
