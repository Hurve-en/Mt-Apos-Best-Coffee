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
    // Simulate page load
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-pulse mb-4">☕</div>
          <p className="text-primary-brown font-semibold">
            Loading premium coffee experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Featured Products */}
      <section className="section-gap bg-gradient-to-b from-yellow-50 to-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-brown mb-4">Our Best Sellers</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Handpicked from Mt. Apo's finest harvest. Each batch is carefully
              roasted to perfection
            </p>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-gap bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-brown mb-4">Why Choose Apo Coffee</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Premium quality meets exceptional service
            </p>
          </div>
          <WhyChooseUs />
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-gap bg-gradient-to-b from-yellow-50 to-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-brown mb-4">What Our Customers Say</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Real reviews from real coffee lovers
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-gap bg-gradient-to-r from-amber-900 to-amber-800 text-cream">
        <div className="container text-center">
          <h2 className="mb-4">Ready for the Perfect Brew?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Explore our complete collection of premium Mt. Apo coffee and find
            your perfect roast
          </p>
          <Link to="/menu" className="btn btn-accent btn-lg">
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}
