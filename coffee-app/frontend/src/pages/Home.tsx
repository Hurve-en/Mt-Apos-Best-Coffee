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
      <div className="flex items-center justify-center min-h-screen bg-coffee-50">
        <div className="text-center animate-fade-in-up">
          {/* simple circle loader */}
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
      {/* Hero Banner */}
      <HeroBanner />

      {/* Featured Products */}
      <section className="section-gap bg-coffee-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-coffee-900 mb-4">Our Best Sellers</h2>
            <p className="text-coffee-700 text-lg max-w-2xl mx-auto">
              Handpicked from Mt. Apo's finest harvest. Each batch is carefully
              roasted to perfection
            </p>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-gap bg-pure-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-coffee-900 mb-4">Why Choose Apo Coffee</h2>
            <p className="text-coffee-700 text-lg max-w-2xl mx-auto">
              Premium quality meets exceptional service
            </p>
          </div>
          <WhyChooseUs />
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-gap bg-coffee-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-coffee-900 mb-4">What Our Customers Say</h2>
            <p className="text-coffee-700 text-lg max-w-2xl mx-auto">
              Real reviews from real coffee lovers
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-gap bg-white border-t border-neutral-200">
        <div className="container text-center">
          <h2 className="mb-4 text-4xl font-extrabold uppercase leading-tight text-coffee-900">
            Ready for the Perfect Brew?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-coffee-700">
            Explore our complete collection of premium Mt. Apo coffee and find
            your perfect roast
          </p>
          <Link
            to="/menu"
            className="btn btn-lg bg-coffee-700 hover:bg-coffee-800 text-pure-white shadow-lg transition-transform transform hover:-translate-y-1"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}
