import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroBanner from "../components/Home/HeroBanner";
import FeaturedProducts from "../components/Home/FeaturedProducts";
import WhyChooseUs from "../components/Home/WhyChooseUs";
import Testimonials from "../components/Home/Testimonials";
import "../styles/premium.css";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Trigger an initial loading state for UX polish
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-coffee-50">
        <div className="text-center animate-fade-in-up">
          {/* Simple spinner */}
          <div className="w-12 h-12 border-4 border-coffee-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-coffee-900 font-semibold">
            Loading your coffee experience…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroBanner />

      <section className="section-gap bg-transparent">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-coffee-500">
              Curated Selection
            </p>
            <h2 className="mb-4 text-coffee-900">Our Best Sellers</h2>
            <p className="mx-auto max-w-2xl text-lg text-coffee-700">
              Handpicked from Mt. Apo's finest harvest. Each batch is carefully
              roasted to perfection
            </p>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      <section className="section-gap bg-transparent">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-coffee-500">
              Crafted Experience
            </p>
            <h2 className="mb-4 text-coffee-900">Why Choose Apo Coffee</h2>
            <p className="mx-auto max-w-2xl text-lg text-coffee-700">
              Premium quality meets exceptional service
            </p>
          </div>
          <WhyChooseUs />
        </div>
      </section>

      <section className="section-gap bg-transparent">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-coffee-500">
              Community Notes
            </p>
            <h2 className="mb-4 text-coffee-900">What Our Customers Say</h2>
            <p className="mx-auto max-w-2xl text-lg text-coffee-700">
              Real reviews from real coffee lovers
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      <section className="section-gap-sm">
        <div className="container">
          <div className="rounded-[36px] border border-[rgba(143,91,54,0.14)] bg-[linear-gradient(140deg,rgba(255,255,255,0.92),rgba(245,241,224,0.98))] px-8 py-14 text-center shadow-[0_24px_70px_rgba(61,31,10,0.08)]">
            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-coffee-500">
              Brew Your Ritual
            </p>
          <h2 className="mb-4 text-coffee-900">
            Ready for the Perfect Brew?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-coffee-700">
            Explore our complete collection of premium Mt. Apo coffee and find
            your perfect roast
          </p>
          <Link
            to="/menu"
            className="btn btn-lg"
          >
            Shop Now
          </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
